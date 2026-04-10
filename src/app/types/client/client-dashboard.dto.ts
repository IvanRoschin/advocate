import type { CaseStatus } from './client-case.dto';
import type { ClientResponseDTO } from './client.dto';

export type ClientDashboardClientDto = Pick<
  ClientResponseDTO,
  | 'id'
  | 'type'
  | 'status'
  | 'fullName'
  | 'email'
  | 'phone'
  | 'companyName'
  | 'taxId'
  | 'address'
>;

export type ClientDashboardAccessDto = {
  accessRole: 'owner' | 'manager' | 'viewer';
  isActive: boolean;
};

export type ClientDashboardCaseDto = {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  currentStage: string;
  updatedAt?: string;
};

export type ClientDashboardOverviewDto = {
  client: ClientDashboardClientDto;
  access: ClientDashboardAccessDto;
  cases: ClientDashboardCaseDto[];
};
