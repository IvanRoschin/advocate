import bcrypt from 'bcryptjs';
import mongoose, { ClientSession, Types } from 'mongoose';

import { baseUrl, routes } from '@/app/config/routes';
import { validate } from '@/app/helpers/validate';
import { caseRepo } from '@/app/lib/repositories/case.repo';
import { leadRepository } from '@/app/lib/repositories/lead.repo';
import { sendEmail } from '@/app/lib/server/mail/emailService';
import { dbConnect } from '@/app/lib/server/mongoose';
import { recaptchaService } from '@/app/lib/server/recaptcha.service';
import { sendTelegramMessage } from '@/app/lib/server/sendTelegram';
import { person } from '@/app/resources';
import { EmailTemplateType } from '@/app/templates/email/types';
import {
  CreateLeadDTO,
  CreateLeadRequestDTO,
  createLeadRequestSchema,
  LeadResponseDTO,
  TokenType,
  UpdateLeadDTO,
  UserRole,
} from '@/app/types';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/lib/server/errors';
import Client from '@/models/Client';
import ClientAccess from '@/models/ClientAccess';
import Lead from '@/models/Lead';
import User from '@/models/User';
import { tokenService } from './token.service';

type ClientAccessRole = 'owner' | 'manager' | 'viewer';

type ExistingUserResolution =
  | { kind: 'create_new_user' }
  | {
      kind: 'link_existing_user';
      user: {
        _id: Types.ObjectId;
        name: string;
        email: string;
        phone?: string;
        role?: string;
        isActive?: boolean;
      };
    };

type ClientAccountUserProvisionResult = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  wasCreated: boolean;
  wasLinked: boolean;
  temporaryPassword?: string;
};

export type ConvertLeadToClientResult = {
  lead: {
    id: string;
    converted: true;
  };
  client: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  clientAccountUser: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    wasCreated: boolean;
    wasLinked: boolean;
    temporaryPassword?: string;
    verificationToken?: string;
  };
  clientAccess: {
    userId: string;
    clientId: string;
    accessRole: ClientAccessRole;
    isActive: true;
  };
  case: unknown;
};

function normalizeEmail(email?: string | null): string {
  return (email ?? '').trim().toLowerCase();
}

function normalizePhone(phone?: string | null): string {
  return (phone ?? '').replace(/\s+/g, '').trim();
}

function generateTempPassword(length = 12): string {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';

  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

function mapLeadToClientCreateData(lead: {
  _id: Types.ObjectId;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
}) {
  return {
    type: 'individual' as const,
    status: 'active' as const,
    fullName: (lead.name ?? '').trim(),
    email: normalizeEmail(lead.email),
    phone: normalizePhone(lead.phone),
    notes: (lead.message ?? '').trim(),
    sourceLeadId: lead._id,
  };
}

async function loadLeadForConversion(leadId: string, session: ClientSession) {
  if (!Types.ObjectId.isValid(leadId)) {
    throw new ValidationError('Некоректний ID ліда', 'INVALID_LEAD_ID');
  }

  const lead = await Lead.findById(leadId, null, { session });

  if (!lead) {
    throw new NotFoundError('Лід не знайдено');
  }

  if (lead.clientId) {
    throw new ConflictError(
      'Лід уже конвертовано в клієнта',
      'LEAD_ALREADY_CONVERTED'
    );
  }

  const normalizedEmail = normalizeEmail(lead.email);
  const normalizedPhone = normalizePhone(lead.phone);

  if (!lead.name?.trim()) {
    throw new ValidationError('У ліда відсутнє імʼя', 'LEAD_NAME_REQUIRED');
  }

  if (!normalizedEmail) {
    throw new ValidationError('У ліда відсутній e-mail', 'LEAD_EMAIL_REQUIRED');
  }

  if (!normalizedPhone) {
    throw new ValidationError(
      'У ліда відсутній телефон',
      'LEAD_PHONE_REQUIRED'
    );
  }

  return lead;
}

async function ensureClientDoesNotExistForLead(
  lead: {
    email?: string | null;
    phone?: string | null;
  },
  session: ClientSession
) {
  const normalizedEmail = normalizeEmail(lead.email);
  const normalizedPhone = normalizePhone(lead.phone);

  const orConditions: Array<Record<string, unknown>> = [];

  if (normalizedEmail) {
    orConditions.push({ email: normalizedEmail });
  }

  if (normalizedPhone) {
    orConditions.push({ phone: normalizedPhone });
  }

  if (!orConditions.length) {
    return;
  }

  const existingClient = await Client.findOne({ $or: orConditions }, null, {
    session,
  });

  if (existingClient) {
    throw new ConflictError(
      'Клієнт з таким e-mail або телефоном уже існує',
      'CLIENT_ALREADY_EXISTS'
    );
  }
}

async function resolveClientAccountUser(
  lead: {
    email?: string | null;
    phone?: string | null;
  },
  session: ClientSession
): Promise<ExistingUserResolution> {
  const normalizedEmail = normalizeEmail(lead.email);
  const normalizedPhone = normalizePhone(lead.phone);

  const userByEmail = normalizedEmail
    ? await User.findOne({ email: normalizedEmail }, null, { session })
    : null;

  const userByPhone = normalizedPhone
    ? await User.findOne({ phone: normalizedPhone }, null, { session })
    : null;

  if (!userByEmail && !userByPhone) {
    return { kind: 'create_new_user' };
  }

  if (userByEmail && userByPhone) {
    if (userByEmail._id.toString() !== userByPhone._id.toString()) {
      throw new ConflictError(
        'E-mail і телефон ліда збігаються з різними користувачами',
        'USER_EMAIL_PHONE_MISMATCH'
      );
    }

    return {
      kind: 'link_existing_user',
      user: {
        _id: userByEmail._id,
        name: userByEmail.name,
        email: userByEmail.email,
        phone: userByEmail.phone,
        role: userByEmail.role,
        isActive: userByEmail.isActive,
      },
    };
  }

  const resolvedUser = userByEmail ?? userByPhone;

  if (!resolvedUser) {
    return { kind: 'create_new_user' };
  }

  return {
    kind: 'link_existing_user',
    user: {
      _id: resolvedUser._id,
      name: resolvedUser.name,
      email: resolvedUser.email,
      phone: resolvedUser.phone,
      role: resolvedUser.role,
      isActive: resolvedUser.isActive,
    },
  };
}

async function createClientFromLead(
  lead: {
    _id: Types.ObjectId;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
  },
  session: ClientSession
) {
  const [client] = await Client.create([mapLeadToClientCreateData(lead)], {
    session,
  });

  return {
    id: client._id.toString(),
    fullName: client.fullName,
    email: client.email,
    phone: client.phone,
  };
}

async function provisionClientAccountUser(params: {
  resolution: ExistingUserResolution;
  lead: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  session: ClientSession;
}): Promise<ClientAccountUserProvisionResult> {
  const { resolution, lead, session } = params;

  const normalizedEmail = normalizeEmail(lead.email);
  const normalizedPhone = normalizePhone(lead.phone);

  if (resolution.kind === 'create_new_user') {
    const temporaryPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    const [createdUser] = await User.create(
      [
        {
          name: (lead.name ?? '').trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          password: passwordHash,
          role: UserRole.CLIENT,
          isActive: false,
        },
      ],
      { session }
    );

    return {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone ?? '',
      isActive: createdUser.isActive ?? false,
      wasCreated: true,
      wasLinked: false,
      temporaryPassword,
    };
  }

  const existingUser = await User.findById(resolution.user._id, null, {
    session,
  });

  if (!existingUser) {
    throw new NotFoundError('Користувача для привʼязки не знайдено');
  }

  existingUser.role = UserRole.CLIENT;

  if (!existingUser.phone && normalizedPhone) {
    existingUser.phone = normalizedPhone;
  }

  if (!existingUser.name && lead.name?.trim()) {
    existingUser.name = lead.name.trim();
  }

  await existingUser.save({ session });

  return {
    id: existingUser._id.toString(),
    name: existingUser.name,
    email: existingUser.email,
    phone: existingUser.phone ?? '',
    isActive: existingUser.isActive ?? false,
    wasCreated: false,
    wasLinked: true,
  };
}

async function ensureOwnerClientAccess(params: {
  userId: string;
  clientId: string;
  session: ClientSession;
}) {
  const { userId, clientId, session } = params;

  const existingAccess = await ClientAccess.findOne(
    { userId, clientId },
    null,
    { session }
  );

  if (existingAccess) {
    if (!existingAccess.isActive) {
      existingAccess.isActive = true;
    }

    if (existingAccess.accessRole !== 'owner') {
      existingAccess.accessRole = 'owner';
    }

    await existingAccess.save({ session });

    return {
      userId,
      clientId,
      accessRole: 'owner' as const,
      isActive: true as const,
    };
  }

  await ClientAccess.create(
    [
      {
        userId,
        clientId,
        accessRole: 'owner',
        isActive: true,
      },
    ],
    { session }
  );

  return {
    userId,
    clientId,
    accessRole: 'owner' as const,
    isActive: true as const,
  };
}

async function createInitialCase(params: {
  lead: {
    _id: Types.ObjectId;
    name?: string | null;
    message?: string | null;
  };
  clientId: string;
  session: ClientSession;
}) {
  const { lead, clientId, session } = params;

  return caseRepo.create(
    {
      clientId,
      title: `Звернення: ${lead.name}`,
      description: lead.message ?? '',
      status: 'new',
      currentStage: 'Первинний аналіз',
      sourceLeadId: lead._id.toString(),
    },
    session
  );
}

async function createVerificationTokenIfNeeded(params: {
  userId: string;
  email: string;
  isActive: boolean;
}) {
  const { userId, email, isActive } = params;

  if (isActive) {
    return undefined;
  }

  const verificationToken = await tokenService.create({
    userId,
    email,
    type: TokenType.VERIFICATION,
  });

  return verificationToken.token;
}

async function finalizeLeadConversion(params: {
  leadId: string;
  clientId: string;
  session: ClientSession;
}) {
  const { leadId, clientId, session } = params;

  const lead = await Lead.findById(leadId, null, { session });

  if (!lead) {
    throw new NotFoundError('Лід не знайдено');
  }

  lead.clientId = new Types.ObjectId(clientId);
  lead.status = 'processed';
  lead.convertedToClient = true;

  await lead.save({ session });

  return {
    id: lead._id.toString(),
    converted: true as const,
  };
}

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

  async convertToClient(leadId: string): Promise<ConvertLeadToClientResult> {
    await dbConnect();

    const mongoSession: ClientSession = await mongoose.startSession();

    try {
      let result: ConvertLeadToClientResult | null = null;

      await mongoSession.withTransaction(async () => {
        const lead = await loadLeadForConversion(leadId, mongoSession);

        await ensureClientDoesNotExistForLead(
          {
            email: lead.email,
            phone: lead.phone,
          },
          mongoSession
        );

        const userResolution = await resolveClientAccountUser(
          {
            email: lead.email,
            phone: lead.phone,
          },
          mongoSession
        );

        const client = await createClientFromLead(
          {
            _id: lead._id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            message: lead.message ?? '',
          },
          mongoSession
        );

        const clientAccountUser = await provisionClientAccountUser({
          resolution: userResolution,
          lead: {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
          },
          session: mongoSession,
        });

        const clientAccess = await ensureOwnerClientAccess({
          userId: clientAccountUser.id,
          clientId: client.id,
          session: mongoSession,
        });

        const createdCase = await createInitialCase({
          lead: {
            _id: lead._id,
            name: lead.name,
            message: lead.message ?? '',
          },
          clientId: client.id,
          session: mongoSession,
        });

        const verificationToken = await createVerificationTokenIfNeeded({
          userId: clientAccountUser.id,
          email: clientAccountUser.email,
          isActive: clientAccountUser.isActive,
        });

        const finalizedLead = await finalizeLeadConversion({
          leadId,
          clientId: client.id,
          session: mongoSession,
        });

        result = {
          lead: finalizedLead,
          client: {
            id: client.id,
            fullName: client.fullName,
            email: client.email,
            phone: client.phone,
          },
          clientAccountUser: {
            ...clientAccountUser,
            verificationToken,
          },
          clientAccess,
          case: createdCase,
        };
      });

      if (!result) {
        throw new ValidationError(
          'Не вдалося завершити конвертацію ліда',
          'LEAD_CONVERSION_FAILED'
        );
      }

      const conversionResult: ConvertLeadToClientResult = result;

      if (
        conversionResult.clientAccountUser.verificationToken &&
        conversionResult.clientAccountUser.temporaryPassword
      ) {
        const verificationUrl =
          `${baseUrl}${routes.public.auth.verifyEmail}` +
          `?token=${conversionResult.clientAccountUser.verificationToken}` +
          `&email=${encodeURIComponent(conversionResult.clientAccountUser.email)}`;

        await sendEmail({
          to: conversionResult.clientAccountUser.email,
          type: EmailTemplateType.ACTIVATE_USER_ACCOUNT,
          props: {
            name: conversionResult.clientAccountUser.name,
            verificationUrl,
            temporaryPassword:
              conversionResult.clientAccountUser.temporaryPassword,
            email: conversionResult.clientAccountUser.email,
          },
        }).catch(console.error);

        await sendEmail({
          to: person.email,
          type: EmailTemplateType.USER_CREATED,
          props: {
            name: conversionResult.clientAccountUser.name,
            email: conversionResult.clientAccountUser.email,
            role: UserRole.CLIENT,
            phone: conversionResult.clientAccountUser.phone,
          },
        }).catch(console.error);
      }

      return result;
    } finally {
      await mongoSession.endSession();
    }
  },
};
