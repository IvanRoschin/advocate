import type { Types } from 'mongoose';

import { toIdString, toIsoString } from '@/app/lib/mappers/_utils';
import type { ClientProfileDto, ClientResponseDTO } from '@/app/types';

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
