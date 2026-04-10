import type { CaseRow } from '@/app/lib/repositories/case.repo';
import { AdminClientCaseDto } from '../client';

const toIsoString = (value?: Date | string | null) => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

export const mapCaseRowToAdminDto = (row: CaseRow): AdminClientCaseDto => ({
  id: row._id.toString(),
  title: row.title,
  description: row.description,
  status: row.status,
  currentStage: row.currentStage,
  createdAt: toIsoString(row.createdAt),
  updatedAt: toIsoString(row.updatedAt),
});
