import {
  AdminDashboardResponseDTO,
  mapAdminDashboardToResponse,
} from '@/app/types';

import { adminDashboardRepo } from '../lib/repositories/admin-dashboard.repo';
import { createAction } from './createAction';

export const adminDashboardActions = {
  getCounters: createAction<void, AdminDashboardResponseDTO>(async () => {
    const counters = await adminDashboardRepo.getCounters();
    return mapAdminDashboardToResponse(counters);
  }),
};
