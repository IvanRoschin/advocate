import { ClientDocument } from '@/app/models/Client';

import type { ClientResponseDTO, CreateClientDTO } from '@/app/types';

// =========================
// CLIENT → RESPONSE DTO
// =========================

export function mapClientToResponse(client: ClientDocument): ClientResponseDTO {
  return {
    id: client._id.toString(),
    type: client.type,
    status: client.status,
    fullName: client.fullName,
    email: client.email,
    phone: client.phone,
    companyName: client.companyName ?? '',
    taxId: client.taxId ?? '',
    address: client.address ?? '',
    notes: client.notes ?? '',
    sourceLeadId: client.sourceLeadId ? client.sourceLeadId.toString() : null,
    createdAt: client.createdAt ? client.createdAt.toISOString() : '',
    updatedAt: client.updatedAt ? client.updatedAt.toISOString() : '',
  };
}

// =========================
// NORMALIZE INPUT
// =========================

export function normalizeClientData(payload: CreateClientDTO): CreateClientDTO {
  return {
    ...payload,
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),

    companyName: payload.companyName?.trim() ?? '',
    taxId: payload.taxId?.trim() ?? '',
    address: payload.address?.trim() ?? '',
    notes: payload.notes?.trim() ?? '',

    sourceLeadId: payload.sourceLeadId ?? null,
    status: payload.status ?? 'active',
  };
}
