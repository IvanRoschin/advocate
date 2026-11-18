import { LeadSource, LeadStatus } from './lead.constants';

/** One visit's source signals (UTM tags, ad click ids, referrer). */
export type LeadTouchDTO = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPage?: string;
  at?: string;
};

/** First and last attributed visits before the lead was submitted. */
export type LeadAttributionDTO = {
  first?: LeadTouchDTO;
  last?: LeadTouchDTO;
};

export type CreateLeadDTO = {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: LeadSource;
  attribution?: LeadAttributionDTO;
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
  attribution?: LeadAttributionDTO;
  createdAt?: string;
  updatedAt?: string;
};
