import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/config/authOptions';
import { caseRepo } from '@/app/lib/repositories/case.repo';
import { clientAccessRepo } from '@/app/lib/repositories/client-access.repo';
import {
  UnauthorizedError,
  ValidationError,
} from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';
import { mapClientCabinetOverview } from '@/app/types';

import { clientRepo } from '../repositories';

export const clientCabinetService = {
  async getMyOverview() {
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

    const cases = await caseRepo.findByClientId(clientId);

    return mapClientCabinetOverview(client, cases);
  },
};
