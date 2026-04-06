import mongoose, { ClientSession } from 'mongoose';

import { validate } from '@/app/helpers/validate';
import { leadRepository } from '@/app/lib/repositories/lead.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { sendEmail } from '@/app/lib/server/mail/emailService';
import { dbConnect } from '@/app/lib/server/mongoose';
import { sendTelegramMessage } from '@/app/lib/server/sendTelegram';
import { person } from '@/app/resources';
import { EmailTemplateType } from '@/app/templates/email/types';
import {
  CreateLeadDTO,
  CreateLeadRequestDTO,
  createLeadRequestSchema,
  LeadResponseDTO,
  mapLeadToClientDraft,
  UpdateLeadDTO,
  UserRole,
} from '@/app/types';

import { generateTempPassword } from '../auth/generateTempPassword';
import { clientRepo, userRepo } from '../repositories';
import { caseRepo } from '../repositories/case.repo';
import { clientAccessRepo } from '../repositories/client-access.repo';
import { recaptchaService } from '../server/recaptcha.service';

async function notifyClient(data: CreateLeadDTO): Promise<void> {
  await sendEmail({
    to: data.email,
    type: EmailTemplateType.LEAD_CLIENT,
    props: {
      name: data.name,
    },
  });
}

async function notifyAdmin(data: CreateLeadDTO): Promise<void> {
  await sendEmail({
    to: person.email,
    type: EmailTemplateType.LEAD_ADMIN,
    props: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      source: data.source,
    },
  });
}

async function notifyTelegram(data: CreateLeadDTO): Promise<void> {
  const lines = [
    '🚨 <b>Нова заявка</b>',
    `Джерело: ${data.source}`,
    `Імʼя: ${data.name}`,
    `Email: ${data.email}`,
    `Телефон: ${data.phone}`,
  ];

  if (data.message) {
    lines.push(`Повідомлення: ${data.message}`);
  }

  await sendTelegramMessage(lines.join('\n'));
}

function checkHoneypot(website?: string): void {
  if (website?.trim()) {
    throw new ValidationError('Bot detected');
  }
}

function normalizeLeadData(body: CreateLeadRequestDTO): CreateLeadDTO {
  return {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    message: body.message?.trim() ?? '',
    source: body.source,
  };
}

export const leadService = {
  async getAll(): Promise<LeadResponseDTO[]> {
    await dbConnect();
    return leadRepository.findAll();
  },

  async getById(id: string): Promise<LeadResponseDTO> {
    await dbConnect();

    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new ValidationError('Лід не знайдено');
    }

    return lead;
  },

  async create(payload: unknown): Promise<LeadResponseDTO> {
    await dbConnect();

    const body = await validate(createLeadRequestSchema, payload);

    checkHoneypot(body.website);
    await recaptchaService.verify(body.recaptchaToken);

    const leadData = normalizeLeadData(body);
    const lead = await leadRepository.create(leadData);

    await notifyClient(leadData).catch(console.error);
    await notifyAdmin(leadData).catch(console.error);
    await notifyTelegram(leadData).catch(console.error);

    return lead;
  },

  async update(id: string, data: UpdateLeadDTO): Promise<LeadResponseDTO> {
    await dbConnect();

    const existingLead = await leadRepository.findById(id);
    if (!existingLead) {
      throw new ValidationError('Лід не знайдено');
    }

    const updateData: UpdateLeadDTO = {
      ...data,
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim(),
      message: data.message?.trim(),
    };

    const updatedLead = await leadRepository.update(id, updateData);

    if (!updatedLead) {
      throw new ValidationError('Не вдалося оновити ліда');
    }

    return updatedLead;
  },

  async delete(id: string) {
    await dbConnect();

    const deleted = await leadRepository.delete(id);
    if (!deleted) {
      throw new ValidationError('Лід не знайдено');
    }

    return deleted;
  },

  async convertToClient(leadId: string) {
    await dbConnect();

    const mongoSession: ClientSession = await mongoose.startSession();

    try {
      let result: {
        lead: unknown;
        client: unknown;
        cabinetUser: {
          email: string;
          phone: string;
          temporaryPassword: string;
        } | null;
        case: unknown | null;
      } | null = null;

      await mongoSession.withTransaction(async () => {
        const lead = await leadRepository.findEntityById(leadId);
        if (!lead) {
          throw new ValidationError('Лід не знайдено');
        }

        if (lead.clientId) {
          const existingLead = await leadRepository.findById(leadId);

          if (!existingLead) {
            throw new ValidationError('Лід не знайдено');
          }

          result = {
            lead: existingLead,
            client: null,
            cabinetUser: null,
            case: null,
          };

          return;
        }

        const clientDraft = mapLeadToClientDraft({
          id: lead._id.toString(),
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          message: lead.message ?? '',
        });

        const client = await clientRepo.create(clientDraft, mongoSession);

        const normalizedEmail = lead.email.trim().toLowerCase();
        const normalizedPhone = lead.phone.trim();

        const existingUserByEmail = await userRepo.findByEmail(normalizedEmail);
        const existingUserByPhone = await userRepo.findByPhone(normalizedPhone);

        if (existingUserByEmail || existingUserByPhone) {
          throw new ValidationError(
            'Для цього клієнта вже існує користувач кабінету'
          );
        }

        const temporaryPassword = generateTempPassword();

        const cabinetUser = await userRepo.create(
          {
            name: lead.name,
            email: normalizedEmail,
            phone: normalizedPhone,
            password: temporaryPassword,
            role: UserRole.CLIENT,
            isActive: true,
          },
          mongoSession
        );

        await clientAccessRepo.create(
          {
            userId: cabinetUser._id.toString(),
            clientId: client.id,
            accessRole: 'owner',
            isActive: true,
          },
          mongoSession
        );

        const createdCase = await caseRepo.create(
          {
            clientId: client.id,
            title: `Звернення: ${lead.name}`,
            description: lead.message ?? '',
            status: 'new',
            currentStage: 'Первинний аналіз',
            sourceLeadId: lead._id.toString(),
          },
          mongoSession
        );

        await leadRepository.updateRaw(
          leadId,
          {
            convertedToClient: true,
            clientId: client.id,
            status: 'processed',
          },
          mongoSession
        );

        const updatedLead = await leadRepository.findById(leadId);

        if (!updatedLead) {
          throw new ValidationError('Не вдалося отримати оновлений лід');
        }

        result = {
          lead: updatedLead,
          client,
          cabinetUser: {
            email: cabinetUser.email,
            phone: cabinetUser.phone ?? '',
            temporaryPassword,
          },
          case: createdCase,
        };
      });

      if (!result) {
        throw new ValidationError('Не вдалося конвертувати ліда');
      }

      return result;
    } finally {
      await mongoSession.endSession();
    }
  },
};
