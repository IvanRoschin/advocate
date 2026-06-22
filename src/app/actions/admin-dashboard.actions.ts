'use server';

import { adminDashboardRepo } from '@/app/lib/repositories/admin-dashboard.repo';
import {
  AdminDashboardResponseDTO,
  mapAdminDashboardToResponse,
} from '@/app/types';

export async function getAdminDashboard(): Promise<AdminDashboardResponseDTO> {
  const counters = await adminDashboardRepo.getCounters();

  return mapAdminDashboardToResponse(counters);
}
