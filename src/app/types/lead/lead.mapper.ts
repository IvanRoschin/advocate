import { toIdString, toIsoString } from '@/app/lib/mappers/_utils';
import type { LeadDocument } from '@/models/Lead';
import type { LeadResponseDTO } from './lead.dto';
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
