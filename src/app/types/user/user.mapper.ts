import mongoose from 'mongoose';

import { User } from '@/models';
import { CreateUserRequestDTO, UserResponseDTO } from '@/types';

export function mapUserToResponse(
  user: typeof User extends infer T
    ? T extends mongoose.Model<infer U>
      ? U
      : never
    : never
): UserResponseDTO {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
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
