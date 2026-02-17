import { UserRole } from './user.enums';

export type CreateUserRequestDTO = {
  name: string;

  email: string;
  password?: string;

  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  googleId?: string;
};

export type UserResponseDTO = {
  _id: string;

  name: string;

  email: string;
  phone?: string;

  role: UserRole;
  isActive: boolean;

  googleId?: string;

  createdAt: string;
  updatedAt: string;
};

export type UpdateUserDTO = Partial<CreateUserRequestDTO>;
