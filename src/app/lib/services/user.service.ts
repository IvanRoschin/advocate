import bcrypt from 'bcryptjs';

import { generatePassword } from '@/app/helpers';
import {
  NotFoundError,
  ValidationError,
} from '@/app/lib/server/errors/httpErrors';
import { tokenService } from '@/app/lib/services/token.service';
import {
  CreateUserRequestDTO,
  mapUserToResponse,
  TokenType,
  UpdateUserDTO,
} from '@/app/types';
import { userRepo } from '@/lib/repositories/user.repo';

export const userService = {
  async getAll() {
    const users = await userRepo.findAll();
    return users.map(mapUserToResponse);
  },

  async getById(id: string) {
    const user = await userRepo.findById(id);
    if (!user) throw new NotFoundError('Користувача не знайдено');
    return mapUserToResponse(user);
  },

  async create(data: CreateUserRequestDTO) {
    const plainPassword = data.password ?? generatePassword(12);
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const user = await userRepo.create({
      ...data,
      password: passwordHash,
      isActive: false,
    });

    const verificationToken = await tokenService.create({
      userId: user._id.toString(),
      type: TokenType.VERIFICATION,
      meta: { plainPassword },
    });

    return { user, verificationToken: verificationToken.token };
  },

  async verifyEmail(tokenValue: string) {
    const verificationToken = await tokenService.verify(
      tokenValue,
      TokenType.VERIFICATION
    );

    const user = await userRepo.findById(verificationToken.userId.toString());
    if (!user) throw new NotFoundError('Користувача не знайдено');

    user.isActive = true;
    await user.save();

    const plainPassword = verificationToken.meta?.plainPassword;
    if (!plainPassword) {
      throw new ValidationError('Пароль недоступний. Спробуйте відновлення.');
    }

    await tokenService.markUsed(verificationToken);

    return {
      user: mapUserToResponse(user),
      plainPassword,
    };
  },

  async activateAccountById(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new NotFoundError('Користувача не знайдено');

    user.isActive = true;
    await user.save();

    return mapUserToResponse(user);
  },

  async changeEmailById(userId: string, newEmail: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new NotFoundError('Користувача не знайдено');

    if (newEmail !== user.email) {
      const exists = await userRepo.findByEmail(newEmail);
      if (exists) throw new ValidationError('Email вже використовується');
    }

    user.email = newEmail;
    await user.save();

    return mapUserToResponse(user);
  },

  async update(id: string, data: UpdateUserDTO) {
    const user = await userRepo.findById(id);
    if (!user) throw new NotFoundError('Користувача не знайдено');

    if (data.email && data.email !== user.email) {
      const exists = await userRepo.findByEmail(data.email);
      if (exists) throw new ValidationError('Email вже використовується');
    }

    if (data.password) {
      const hash = await bcrypt.hash(data.password, 10);
      user.password = hash;
      delete data.password;
    }

    Object.assign(user, data);
    await user.save();

    return mapUserToResponse(user);
  },

  async delete(id: string) {
    const deleted = await userRepo.delete(id);
    if (!deleted) throw new NotFoundError('Користувача не знайдено');
    return mapUserToResponse(deleted);
  },
};
