import 'server-only';

import { validate } from '@/app/helpers/validate';
import { leadRepo } from '@/app/lib/repositories/lead.repo';
import { createLeadRequestSchema, mapLeadToResponse } from '@/app/types';

import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';
import { createPublicAction } from './createPublicAction';
import { convertLeadToClient } from './lead-conversion.helpers';
import { notifyLeadCreated } from './lead-notifications.helpers';

import type {
  CreateLeadDTO,
  CreateLeadRequestDTO,
  LeadResponseDTO,
} from '@/app/types';
import type { ConvertLeadToClientResult } from './lead-conversion.types';
/* ================= CRUD (generic) ================= */

export const leadActions = createEntityModule({
  repo: leadRepo,

  toDTO: mapLeadToResponse,
  toListDTO: mapLeadToResponse,

  slug: {
    enabled: false,
  },

  validation: {
    notFoundMessage: 'Lead not found',
  },
});

/* ================= Public ================= */

function normalizeLeadData(body: CreateLeadRequestDTO): CreateLeadDTO {
  return {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    message: body.message?.trim() ?? '',
    source: body.source,
  };
}

export const leadPublicActions = {
  create: createPublicAction<
    Partial<CreateLeadRequestDTO> & {
      website?: string;
      turnstileToken?: string;
    },
    LeadResponseDTO
  >(async ({ args: payload }) => {
    const body = await validate(createLeadRequestSchema, payload);
    const leadData = normalizeLeadData(body);
    const lead = await leadRepo.create(leadData);

    await notifyLeadCreated(leadData);

    return mapLeadToResponse(lead);
  }),
};

/* ================= Admin ================= */

export const leadAdminActions = {
  convertToClient: createAction<string, ConvertLeadToClientResult>(
    async ({ args: leadId }) => convertLeadToClient(leadId)
  ),
};
