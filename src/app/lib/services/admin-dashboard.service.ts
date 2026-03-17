import {
  AdminDashboardResponseDTO,
  mapAdminDashboardToResponse,
} from '@/app/types';
import { adminDashboardRepo } from '@/lib/repositories/admin-dashboard.repo';

export const adminDashboardService = {
  async getDashboard(): Promise<AdminDashboardResponseDTO> {
    const counters = await adminDashboardRepo.getCounters();
    return mapAdminDashboardToResponse(counters);
  },
};
