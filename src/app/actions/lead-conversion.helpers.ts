import 'server-only';

import bcrypt from 'bcryptjs';
import mongoose, { ClientSession, Types } from 'mongoose';

import { baseUrl, routes } from '@/app/config/routes';
import { caseRepo } from '@/app/lib/repositories/case.repo';
import { dbConnect } from '@/app/lib/server/mongoose';
import { TokenType, UserRole } from '@/app/types';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/lib/server/errors';
import Client from '@/models/Client';
import ClientAccess from '@/models/ClientAccess';
import Lead from '@/models/Lead';
import User from '@/models/User';

import { notifyClientAccountProvisioned } from './lead-notifications.helpers';
import { tokenActions } from './token.actions';

import type {
  ClientAccountUserProvisionResult,
  ConvertLeadToClientResult,
  ExistingUserResolution,
} from './lead-conversion.types';
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
  lead: { email?: string | null; phone?: string | null },
  session: ClientSession
) {
  const normalizedEmail = normalizeEmail(lead.email);
  const normalizedPhone = normalizePhone(lead.phone);

  const orConditions: Array<Record<string, unknown>> = [];

  if (normalizedEmail) orConditions.push({ email: normalizedEmail });
  if (normalizedPhone) orConditions.push({ phone: normalizedPhone });

  if (!orConditions.length) return;

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
  lead: { email?: string | null; phone?: string | null },
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
  lead: { name?: string | null; email?: string | null; phone?: string | null };
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
    if (!existingAccess.isActive) existingAccess.isActive = true;
    if (existingAccess.accessRole !== 'owner')
      existingAccess.accessRole = 'owner';

    await existingAccess.save({ session });

    return {
      userId,
      clientId,
      accessRole: 'owner' as const,
      isActive: true as const,
    };
  }

  await ClientAccess.create(
    [{ userId, clientId, accessRole: 'owner', isActive: true }],
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
  lead: { _id: Types.ObjectId; name?: string | null; message?: string | null };
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

  if (isActive) return undefined;

  const verificationToken = await tokenActions.create({
    userId: new Types.ObjectId(userId),
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

  return { id: lead._id.toString(), converted: true as const };
}

export async function convertLeadToClient(
  leadId: string
): Promise<ConvertLeadToClientResult> {
  await dbConnect();

  const mongoSession: ClientSession = await mongoose.startSession();

  try {
    let result: ConvertLeadToClientResult | null = null;

    await mongoSession.withTransaction(async () => {
      const lead = await loadLeadForConversion(leadId, mongoSession);

      await ensureClientDoesNotExistForLead(
        { email: lead.email, phone: lead.phone },
        mongoSession
      );

      const userResolution = await resolveClientAccountUser(
        { email: lead.email, phone: lead.phone },
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
        lead: { name: lead.name, email: lead.email, phone: lead.phone },
        session: mongoSession,
      });

      const clientAccess = await ensureOwnerClientAccess({
        userId: clientAccountUser.id,
        clientId: client.id,
        session: mongoSession,
      });

      const createdCase = await createInitialCase({
        lead: { _id: lead._id, name: lead.name, message: lead.message ?? '' },
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
        clientAccountUser: { ...clientAccountUser, verificationToken },
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

    await notifyClientAccountProvisioned(
      baseUrl,
      routes.public.auth.verifyEmail,
      result
    );

    return result;
  } finally {
    await mongoSession.endSession();
  }
}
