import { toIdString, toIsoString } from '@/app/lib/mappers/_utils';

import type { CaseRow } from '@/app/lib/repositories/case.repo';
import type {
  ClientDashboardCaseDto,
  ClientDashboardClientDto,
  ClientDashboardOverviewDto,
  ClientResponseDTO,
} from '@/app/types';

const mapClientToDashboardClientDto = (
  client: ClientResponseDTO
): ClientDashboardClientDto => ({
  id: toIdString(client.id),
  type: client.type,
  status: client.status,
  fullName: client.fullName,
  email: client.email,
  phone: client.phone,
  companyName: client.companyName,
  taxId: client.taxId,
  address: client.address,
});

const mapCaseRowToDashboardCaseDto = (
  row: CaseRow
): ClientDashboardCaseDto => ({
  id: toIdString(row._id),
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
