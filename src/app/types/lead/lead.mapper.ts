import { toIdString, toIsoString } from '@/app/lib/mappers/_utils';
import type { LeadDocument } from '@/models/Lead';
import { cleanLeadAttribution } from './lead.attribution';
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
    attribution: cleanLeadAttribution(lead.attribution),
    createdAt: toIsoString(lead.createdAt),
    updatedAt: toIsoString(lead.updatedAt),
  };
}
