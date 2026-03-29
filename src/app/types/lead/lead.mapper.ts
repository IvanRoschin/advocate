import type { LeadDocument } from '@/models/Lead';
import { CreateClientDTO } from '../client';
import type {
  CreateLeadDTO,
  LeadResponseDTO,
  LeadToClientDraftInput,
} from './lead.dto';

export function mapLeadToResponse(lead: LeadDocument): LeadResponseDTO {
  return {
    id: lead._id.toString(),
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message ?? '',
    source: lead.source,
    status: lead.status,
    convertedToClient: lead.convertedToClient,
    clientId: lead.clientId ? lead.clientId.toString() : null,
    notes: lead.notes ?? '',
    assignedToUserId: lead.assignedToUserId
      ? lead.assignedToUserId.toString()
      : null,
    createdAt: lead.createdAt ? new Date(lead.createdAt).toISOString() : '',
    updatedAt: lead.updatedAt ? new Date(lead.updatedAt).toISOString() : '',
  };
}

export function mapLeadResponseToCreate(dto: LeadResponseDTO): CreateLeadDTO {
  return {
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    message: dto.message,
    source: dto.source,
  };
}

export function mapLeadToClientDraft(
  lead: LeadToClientDraftInput
): CreateClientDTO {
  return {
    type: 'individual',
    fullName: lead.name.trim(),
    email: lead.email.trim().toLowerCase(),
    phone: lead.phone.trim(),
    notes: lead.message.trim(),
    sourceLeadId: lead.id,
  };
}
