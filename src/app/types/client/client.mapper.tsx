import type { Types } from 'mongoose';

import type {
  ClientProfileDto,
  ClientResponseDTO,
  CreateClientDTO,
} from '@/app/types';

type ClientLike = {
  _id: Types.ObjectId | string;
  type: ClientResponseDTO['type'];
  status: ClientResponseDTO['status'];
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  taxId?: string;
  address?: string;
  notes?: string;
  sourceLeadId?: Types.ObjectId | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

const toIdString = (value?: Types.ObjectId | string | null): string | null => {
  if (!value) return null;
  return typeof value === 'string' ? value : value.toString();
};

const toIsoString = (value?: Date | string | null): string | undefined => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

export function mapClientToResponse(client: ClientLike): ClientResponseDTO {
  return {
    id: toIdString(client._id) ?? '',
    type: client.type,
    status: client.status,
    fullName: client.fullName,
    email: client.email,
    phone: client.phone,
    companyName: client.companyName ?? '',
    taxId: client.taxId ?? '',
    address: client.address ?? '',
    notes: client.notes ?? '',
    sourceLeadId: toIdString(client.sourceLeadId),
    createdAt: toIsoString(client.createdAt),
    updatedAt: toIsoString(client.updatedAt),
  };
}

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

export const mapClientToProfileDto = (
  client: ClientResponseDTO
): ClientProfileDto => ({
  id: client.id,
  type: client.type,
  status: client.status,
  fullName: client.fullName,
  email: client.email,
  phone: client.phone,
  companyName: client.companyName,
  address: client.address,
});
