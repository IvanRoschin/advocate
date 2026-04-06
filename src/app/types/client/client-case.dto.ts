export type AdminClientCaseDto = {
  id: string;
  title: string;
  description: string;
  status:
    | 'new'
    | 'in_progress'
    | 'awaiting_client'
    | 'in_court'
    | 'completed'
    | 'archived';
  currentStage: string;
  createdAt?: string;
  updatedAt?: string;
};
