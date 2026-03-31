import crypto from 'crypto';
import { Types } from 'mongoose';

import { tokenRepo } from '@/app/lib/repositories/token.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { TokenDocument } from '@/app/models/Token';
import { CreateTokenDTO, TokenType } from '@/app/types';

// ❗️НУЖНО: подключить userService / userRepo (пример ниже)
// import { userService } from '@/app/lib/services/user.service';

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
      [TokenType.PASSWORD_RESET]: 60 * 60 * 2,
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
    return tokenRepo.findValid(tokenValue, type);
  },

  async markUsed(token: TokenDocument): Promise<void> {
    if (token.used) return;

    token.used = true;
    token.meta = undefined; // ⚠️ см. “правильный фикс” ниже
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

  // ✅ ДОБАВЛЕНО: activateAccount
  async activateAccount(token: TokenDocument) {
    if (token.type !== TokenType.VERIFICATION) {
      throw new ValidationError('Невірний тип токена');
    }

    // TODO: заменишь на свою реализацию userService/userRepo
    // const user = await userService.activateAccountById(token.userId.toString());

    // ВРЕМЕННО: если нет userService, кинь ошибку явно, чтобы не “молчать”
    throw new ValidationError(
      'activateAccount() не подключен: добавь userService/userRepo'
    );

    // return user;
  },

  // ✅ ДОБАВЛЕНО: changeEmail
  async changeEmail(token: TokenDocument) {
    if (token.type !== TokenType.EMAIL_CHANGE) {
      throw new ValidationError('Невірний тип токена');
    }

    // Обычно новый email либо token.email, либо token.meta.newEmail
    const newEmail = token.email; /* ?? token.meta?.newEmail */
    if (!newEmail) {
      throw new ValidationError('Не вказано новий email у токені');
    }

    // TODO: заменишь на свою реализацию userService/userRepo
    // const user = await userService.changeEmailById(token.userId.toString(), newEmail);

    throw new ValidationError(
      'changeEmail() не подключен: добавь userService/userRepo'
    );

    // return user;
  },
};
