import { toIdString, toIsoString } from '@/app/lib/mappers/_utils';
import type { LeadDocument } from '@/models/Lead';
import { CreateClientDTO } from '../client';
import type {
  CreateLeadDTO,
  LeadResponseDTO,
  LeadToClientDraftInput,
} from './lead.dto';
export function mapLeadToResponse(lead: LeadDocument): LeadResponseDTO {
  return {
    id: toIdString(lead._id),
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message ?? '',
    source: lead.source,
    status: lead.status,
    convertedToClient: lead.convertedToClient,
    clientId: lead.clientId ? toIdString(lead.clientId) : null,
    notes: lead.notes ?? '',
    assignedToUserId: lead.assignedToUserId
      ? toIdString(lead.assignedToUserId)
      : null,
    createdAt: toIsoString(lead.createdAt),
    updatedAt: toIsoString(lead.updatedAt),
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
