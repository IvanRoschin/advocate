import 'server-only';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/config/authOptions';
import {
  UnauthorizedError,
  ValidationError,
} from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';
import {
  ClientProfileDto,
  mapClientToDashboardOverviewDto,
  mapClientToProfileDto,
  UpdateClientProfileDto,
} from '@/app/types';

import { clientRepo } from '../lib/repositories';
import { caseQueries } from '../lib/repositories/case.repo';
import { clientAccessRepo } from '../lib/repositories/client-access.repo';
import { createAction } from './createAction';

const getAuthorizedClientAccess = async () => {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new UnauthorizedError('Неавторизований користувач');
  }

  const access = await clientAccessRepo.findPreferredActiveByUserId(userId);
  if (!access) {
    throw new ValidationError('Клієнтський профіль не знайдено');
  }

  return access;
};

// ====================== SERVER ACTIONS ======================

export const clientAccessActions = {
  getMyOverview: createAction(async () => {
    const access = await getAuthorizedClientAccess();

    const client = await clientRepo.findById(access.clientId.toString());
    if (!client) {
      throw new ValidationError('Клієнта не знайдено');
    }

    const cases = await caseQueries.findByClientId(client.id.toString());

    return mapClientToDashboardOverviewDto(client, cases);
  }),

  getMyProfile: createAction(async () => {
    const access = await getAuthorizedClientAccess();

    const client = await clientRepo.findById(access.clientId.toString());
    if (!client) {
      throw new ValidationError('Клієнта не знайдено');
    }

    return mapClientToProfileDto(client);
  }),

  updateMyProfile: createAction<
    { data: UpdateClientProfileDto },
    ClientProfileDto
  >(async ({ args }) => {
    const access = await getAuthorizedClientAccess();

    const client = await clientRepo.findById(access.clientId.toString());
    if (!client) {
      throw new ValidationError('Клієнта не знайдено');
    }

    const updated = await clientRepo.update(client.id, {
      fullName: args.data.fullName,
      email: args.data.email.toLowerCase(),
      phone: args.data.phone,
      address: args.data.address,
      companyName: args.data.companyName,
      type: args.data.type,
    });

    if (!updated) {
      throw new ValidationError('Не вдалося оновити профіль');
    }

    return mapClientToProfileDto(updated);
  }),
};
