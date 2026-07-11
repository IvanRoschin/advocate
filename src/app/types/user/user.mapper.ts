import { HydratedDocument } from 'mongoose';

import { toIsoString } from '@/app/lib/mappers/_utils';
import { CreateUserRequestDTO, UserResponseDTO } from '@/types';
import { UserRole } from './user.enums';

export type UserEntity = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  googleId?: string;
  isActive: boolean;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
};

export type UserLean = HydratedDocument<UserEntity>;

export function mapUserToResponse(user: UserLean): UserResponseDTO {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: toIsoString(user.createdAt),
    updatedAt: toIsoString(user.updatedAt),
  };
}

export function mapCreateRequestToUser(dto: CreateUserRequestDTO) {
  return {
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    role: dto.role,
  };
}
