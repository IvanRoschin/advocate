import type { CaseRow } from '@/app/lib/repositories/case.repo';
import type {
  ClientDashboardCaseDto,
  ClientDashboardClientDto,
  ClientDashboardOverviewDto,
  ClientResponseDTO,
} from '@/app/types';

const toIsoString = (value?: Date | string | null): string | undefined => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

export const mapClientToDashboardClientDto = (
  client: ClientResponseDTO
): ClientDashboardClientDto => ({
  id: client.id,
  type: client.type,
  status: client.status,
  fullName: client.fullName,
  email: client.email,
  phone: client.phone,
  companyName: client.companyName,
  taxId: client.taxId,
  address: client.address,
});

export const mapCaseRowToDashboardCaseDto = (
  row: CaseRow
): ClientDashboardCaseDto => ({
  id: row._id.toString(),
  title: row.title,
  description: row.description ?? '',
  status: row.status,
  currentStage: row.currentStage ?? '',
  updatedAt: toIsoString(row.updatedAt),
});

export const mapClientToDashboardOverviewDto = (
  client: ClientResponseDTO,
  cases: CaseRow[]
): ClientDashboardOverviewDto => ({
  client: mapClientToDashboardClientDto(client),
  access: {
    accessRole: 'owner',
    isActive: client.status === 'active',
  },
  cases: cases.map(mapCaseRowToDashboardCaseDto),
});
