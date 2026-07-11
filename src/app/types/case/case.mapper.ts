import { toIsoString } from '@/app/lib/mappers/_utils';
import type { CaseRow } from '@/app/lib/repositories/case.repo';

import { AdminClientCaseDto } from '../client';

export const mapCaseRowToAdminDto = (row: CaseRow): AdminClientCaseDto => ({
  id: row._id.toString(),
  title: row.title,
  description: row.description,
  status: row.status,
  currentStage: row.currentStage,
  createdAt: toIsoString(row.createdAt),
  updatedAt: toIsoString(row.updatedAt),
});
