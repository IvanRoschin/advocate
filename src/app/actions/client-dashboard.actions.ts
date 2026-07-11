import 'server-only';

import { caseQueries } from '@/app/lib/repositories/case.repo';
import { clientRepo } from '@/app/lib/repositories/client.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';

import { createAction } from './createAction';

import type { ClientDashboardOverviewDto } from '@/app/types';
const toIsoString = (value?: Date | string | null): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  return value.toISOString();
};

// ====================== SERVER ACTIONS ======================

export const clientDashboardActions = {
  getByClientId: createAction<{ clientId: string }, ClientDashboardOverviewDto>(
    async ({ args }) => {
      await dbConnect();

      const client = await clientRepo.findById(args.clientId);

      if (!client) {
        throw new ValidationError('Клієнта не знайдено');
      }

      const cases = await caseQueries.findByClientId(args.clientId);

      return {
        client: {
          id: client.id,
          type: client.type,
          status: client.status,
          fullName: client.fullName,
          email: client.email,
          phone: client.phone,
          companyName: client.companyName || '',
          taxId: client.taxId || '',
          address: client.address || '',
        },
        access: {
          accessRole: 'owner' as const,
          isActive: client.status === 'active',
        },
        cases: cases.map(item => ({
          id: item._id.toString(),
          title: item.title,
          description: item.description || '',
          status: item.status,
          currentStage: item.currentStage || '',
          updatedAt: toIsoString(item.updatedAt),
        })),
      };
    }
  ),
};
