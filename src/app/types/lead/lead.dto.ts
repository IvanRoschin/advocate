import { LeadSource, LeadStatus } from './lead.constants';

export type CreateLeadDTO = {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: LeadSource;
};

export type UpdateLeadDTO = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: LeadSource;
  status?: LeadStatus;
  convertedToClient?: boolean;
  clientId?: string | null;
  notes?: string;
  assignedToUserId?: string | null;
};

export type LeadResponseDTO = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  convertedToClient: boolean;
  clientId: string | null;
  notes: string;
  assignedToUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadToClientDraftInput = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};
