export const CLIENT_TYPES = ['individual', 'company'] as const;
export const CLIENT_STATUSES = ['active', 'inactive'] as const;

export type ClientType = (typeof CLIENT_TYPES)[number];
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export type ClientResponseDTO = {
  id: string;
  type: ClientType;
  status: ClientStatus;

  fullName: string;
  email: string;
  phone: string;

  companyName: string;
  taxId: string;
  address: string;

  notes: string;

  sourceLeadId: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateClientDTO = {
  type: ClientType;
  status?: ClientStatus;

  fullName: string;
  email: string;
  phone: string;

  companyName?: string;
  taxId?: string;
  address?: string;

  notes?: string;

  sourceLeadId?: string | null;
};

export type UpdateClientDTO = Partial<{
  type: ClientType;
  status: ClientStatus;

  fullName: string;
  email: string;
  phone: string;

  companyName: string;
  taxId: string;
  address: string;

  notes: string;
}>;
