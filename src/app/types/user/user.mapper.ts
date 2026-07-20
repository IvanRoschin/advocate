import { Types } from 'mongoose';

import { toIsoString } from '@/app/lib/mappers/_utils';
import { UserResponseDTO } from '@/types';

import { UserRole } from './user.enums';

type UserEntity = {
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

export type UserLean = UserEntity;

type UserLike = {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

export function mapUserToResponse(user: UserLike): UserResponseDTO {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    role: user.role,
    isActive: user.isActive,
    createdAt: toIsoString(user.createdAt),
    updatedAt: toIsoString(user.updatedAt),
  };
}
