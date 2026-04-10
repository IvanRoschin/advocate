import crypto from 'crypto';
import { Types } from 'mongoose';

import { tokenRepo } from '@/app/lib/repositories/token.repo';
import { userRepo } from '@/app/lib/repositories/user.repo';
import {
  NotFoundError,
  ValidationError,
} from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';
import { TokenDocument } from '@/app/models/Token';
import { CreateTokenDTO, mapUserToResponse, TokenType } from '@/app/types';

export const tokenService = {
  generateTokenString(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  },

  async create<T extends TokenType>(
    data: CreateTokenDTO<T>
  ): Promise<TokenDocument> {
    const token = this.generateTokenString();

    const ttlDefault: Record<TokenType, number> = {
      [TokenType.REFRESH]: 60 * 60 * 24 * 30,
      [TokenType.VERIFICATION]: 60 * 60 * 24,
      [TokenType.RESET_PASSWORD]: 60 * 60 * 2,
      [TokenType.EMAIL_CHANGE]: 60 * 60,
      [TokenType.PASSWORD_RESTORE]: 60 * 60,
    };

    const ttl = data.ttlSeconds ?? ttlDefault[data.type ?? TokenType.REFRESH];
    const expiresAt = new Date(Date.now() + ttl * 1000);

    return tokenRepo.create({
      userId: new Types.ObjectId(data.userId),
      token,
      type: data.type ?? TokenType.REFRESH,
      email: data.email,
      meta: data.meta,
      used: false,
      expiresAt,
    });
  },

  async findValid<T extends TokenType>(
    tokenValue: string,
    type?: T
  ): Promise<TokenDocument | null> {
    await dbConnect();
    return tokenRepo.findValid(tokenValue, type);
  },

  async markUsed(token: TokenDocument): Promise<void> {
    if (token.used) return;

    token.used = true;
    token.meta = undefined;
    await token.save();
  },

  async verify<T extends TokenType>(
    tokenValue: string,
    type?: T
  ): Promise<TokenDocument> {
    const token = await this.findValid(tokenValue, type);

    if (!token) {
      throw new ValidationError('Недійсний або використаний токен');
    }

    return token;
  },

  async activateAccount(token: TokenDocument) {
    await dbConnect();

    if (token.type !== TokenType.VERIFICATION) {
      throw new ValidationError('Невірний тип токена');
    }

    const user = await userRepo.findById(token.userId.toString());
    if (!user) {
      throw new NotFoundError('Користувача не знайдено');
    }

    user.isActive = true;
    await user.save();

    await this.markUsed(token);

    return mapUserToResponse(user);
  },

  async changeEmail(token: TokenDocument) {
    await dbConnect();

    if (token.type !== TokenType.EMAIL_CHANGE) {
      throw new ValidationError('Невірний тип токена');
    }

    const newEmail = token.email;
    if (!newEmail) {
      throw new ValidationError('Не вказано новий email у токені');
    }

    const user = await userRepo.findById(token.userId.toString());
    if (!user) {
      throw new NotFoundError('Користувача не знайдено');
    }

    const normalizedEmail = newEmail.trim().toLowerCase();

    if (normalizedEmail !== user.email) {
      const exists = await userRepo.findByEmail(normalizedEmail);
      if (exists) {
        throw new ValidationError('Email вже використовується');
      }
    }

    user.email = normalizedEmail;
    await user.save();

    await this.markUsed(token);

    return mapUserToResponse(user);
  },
};
