export type ClientCabinetCaseDto = {
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
  updatedAt?: string;
};

export type ClientCabinetOverviewDto = {
  client: {
    id: string;
    type: 'individual' | 'company';
    status: 'active' | 'inactive';
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
    address: string;
  };
  cases: ClientCabinetCaseDto[];
};
