import { CaseStatus } from '../client';

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
