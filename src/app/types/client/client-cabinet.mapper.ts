import type { CaseRow } from '@/app/lib/repositories/case.repo';
import type {
  ClientCabinetCaseDto,
  ClientCabinetOverviewDto,
  ClientResponseDTO,
} from '@/app/types';

const toIsoString = (value?: Date | string | null) => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

export const mapCaseRowToClientCabinetCase = (
  row: CaseRow
): ClientCabinetCaseDto => ({
  id: row._id.toString(),
  title: row.title,
  description: row.description,
  status: row.status,
  currentStage: row.currentStage,
  updatedAt: toIsoString(row.updatedAt),
});

export const mapClientCabinetOverview = (
  client: ClientResponseDTO,
  cases: CaseRow[]
): ClientCabinetOverviewDto => ({
  client: {
    id: client.id.toString(),
    type: client.type,
    status: client.status,
    fullName: client.fullName,
    email: client.email,
    phone: client.phone,
    companyName: client.companyName,
    address: client.address,
  },
  cases: cases.map(mapCaseRowToClientCabinetCase),
});
