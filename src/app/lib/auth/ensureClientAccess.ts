import { repairClientAccessService } from '@/app/lib/services/repair-client-access.service';

export async function ensureClientAccess(userId: string) {
  return repairClientAccessService.execute(userId);
}
