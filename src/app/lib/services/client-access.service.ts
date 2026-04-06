import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/config/authOptions';
import { clientRepo } from '@/app/lib/repositories';
import { caseRepo } from '@/app/lib/repositories/case.repo';
import { clientAccessRepo } from '@/app/lib/repositories/client-access.repo';
import {
  UnauthorizedError,
  ValidationError,
} from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';
import {
  mapClientCabinetOverview,
  mapClientToProfileDto,
  UpdateClientProfileDto,
} from '@/app/types';

const getAuthorizedClient = async () => {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new UnauthorizedError('Неавторизований користувач');
  }

  const access = await clientAccessRepo.findActiveByUserId(userId);
  if (!access) {
    throw new ValidationError('Клієнтський профіль не знайдено');
  }

  const clientId = access.clientId.toString();

  const client = await clientRepo.findById(clientId);
  if (!client) {
    throw new ValidationError('Клієнта не знайдено');
  }

  return client;
};

export const clientCabinetService = {
  async getMyOverview() {
    const client = await getAuthorizedClient();
    const cases = await caseRepo.findByClientId(client.id.toString());

    return mapClientCabinetOverview(client, cases);
  },

  async getMyProfile() {
    const client = await getAuthorizedClient();
    return mapClientToProfileDto(client);
  },

  async updateMyProfile(data: UpdateClientProfileDto) {
    const client = await getAuthorizedClient();

    const updated = await clientRepo.updateProfileById(client.id, {
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      address: data.address,
      companyName: data.companyName,
      type: data.type,
    });

    if (!updated) {
      throw new ValidationError('Не вдалося оновити профіль');
    }

    return mapClientToProfileDto(updated);
  },
};
