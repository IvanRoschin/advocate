import type { ClientResponseDTO } from './client.dto';

export type ClientProfileDto = Pick<
  ClientResponseDTO,
  | 'id'
  | 'type'
  | 'status'
  | 'fullName'
  | 'email'
  | 'phone'
  | 'companyName'
  | 'address'
>;

export type UpdateClientProfileDto = Pick<
  ClientResponseDTO,
  'type' | 'fullName' | 'email' | 'phone' | 'companyName' | 'address'
>;
