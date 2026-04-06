import type { ClientProfileDto, ClientResponseDTO } from '@/app/types';

export const mapClientToProfileDto = (
  client: ClientResponseDTO
): ClientProfileDto => ({
  id: client.id.toString(),
  type: client.type,
  status: client.status,
  fullName: client.fullName,
  email: client.email,
  phone: client.phone,
  companyName: client.companyName ?? '',
  address: client.address ?? '',
});
