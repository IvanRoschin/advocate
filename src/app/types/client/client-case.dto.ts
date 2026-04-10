export const CASE_STATUSES = [
  'new',
  'in_progress',
  'awaiting_client',
  'in_court',
  'completed',
  'archived',
] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];

export type AdminClientCaseDto = {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  currentStage: string;
  createdAt?: string;
  updatedAt?: string;
};
