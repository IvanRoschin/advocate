import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import {
  CreateUserRequestDTO,
  mapUserToResponse,
  UpdateUserDTO,
} from '@/app/types';
import { userRepo } from '@/lib/repositories/user.repo';

export const userService = {
  async getAll() {
    return userRepo.findAll();
  },

  async getById(id: string) {
    const user = await userRepo.findById(id);
    if (!user) throw new ValidationError('Користувача не знайдено');

    const dto = mapUserToResponse(user);

    return dto;
  },

  async create(data: CreateUserRequestDTO) {
    const existing = await userRepo.findByEmail(data.email);
    if (existing) {
      throw new ValidationError('Користувач з таким email вже існує');
    }

    const user = await userRepo.create(data);

    if (data.password) {
      user.setPassword(data.password);
      await user.save();
    }

    return user;
  },

  async update(id: string, data: UpdateUserDTO) {
    const user = await userRepo.findById(id);
    if (!user) throw new ValidationError('Користувача не знайдено');

    if (data.email && data.email !== user.email) {
      const exists = await userRepo.findByEmail(data.email);
      if (exists) {
        throw new ValidationError('Email вже використовується');
      }
    }

    if (data.password) {
      user.setPassword(data.password);
      delete data.password;
    }

    Object.assign(user, data);
    await user.save();

    return user;
  },

  async delete(id: string) {
    const deleted = await userRepo.delete(id);
    if (!deleted) throw new ValidationError('Користувача не знайдено');
    return deleted;
  },
};
