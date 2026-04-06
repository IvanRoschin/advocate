export type CaseStatus =
  | 'new'
  | 'in_progress'
  | 'awaiting_client'
  | 'in_court'
  | 'completed'
  | 'archived';

export type AdminClientCaseDto = {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: CaseStatus;
  currentStage: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCaseDTO = {
  title: string;
  description?: string;
  status?: CaseStatus;
  currentStage?: string;
  sourceLeadId?: string | null;
  assignedLawyerId?: string | null;
};

export type UpdateCaseDTO = Partial<{
  title: string;
  description: string;
  status: CaseStatus;
  currentStage: string;
  sourceLeadId: string | null;
  assignedLawyerId: string | null;
}>;
