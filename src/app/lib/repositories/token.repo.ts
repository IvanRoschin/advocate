import crypto from 'crypto';
import { Types } from 'mongoose';

import { CreateTokenDTO, mapUserToResponse, TokenType } from '@/app/types';
import Token, { TokenDB, TokenDocument } from '@/models/Token';

import { ensureUserClient } from '../auth/ensureClientAccess';
import { userRepo } from './user.repo';

function generateTokenString(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

const TTL_SECONDS_BY_TYPE: Record<TokenType, number> = {
  [TokenType.REFRESH]: 60 * 60 * 24 * 30,
  [TokenType.VERIFICATION]: 60 * 60 * 24,
  [TokenType.RESET_PASSWORD]: 60 * 60 * 2,
  [TokenType.EMAIL_CHANGE]: 60 * 60,
  [TokenType.PASSWORD_RESTORE]: 60 * 60,
};

export const tokenRepo = {
  async create<T extends TokenType>(data: CreateTokenDTO<T>) {
    const type = data.type ?? TokenType.REFRESH;
    const ttl = data.ttlSeconds ?? TTL_SECONDS_BY_TYPE[type];

    return Token.create({
      userId: new Types.ObjectId(data.userId),
      token: generateTokenString(),
      type,
      email: data.email,
      meta: data.meta,
      used: false,
      expiresAt: new Date(Date.now() + ttl * 1000),
    });
  },

  async findValid(token: string, type?: TokenType) {
    const query: Partial<TokenDB> & { token: string; used: boolean } = {
      token,
      used: false,
    };
    if (type) query.type = type;

    const tokenDoc = await Token.findOne(query);
    if (!tokenDoc) return null;

    if (tokenDoc.expiresAt && tokenDoc.expiresAt < new Date()) {
      tokenDoc.used = true;
      await tokenDoc.save();
      return null;
    }

    return tokenDoc as TokenDocument;
  },

  async markUsed(tokenDoc: TokenDocument) {
    if (tokenDoc.used) return;
    tokenDoc.used = true;
    tokenDoc.meta = undefined;
    await tokenDoc.save();
  },

  async changeEmail(token: TokenDocument) {
    if (token.type !== TokenType.EMAIL_CHANGE) {
      throw new Error('Невірний тип токена');
    }

    const newEmail = token.email;
    if (!newEmail) {
      throw new Error('Не вказано новий email у токені');
    }

    const user = await userRepo.findById(token.userId.toString());
    if (!user) {
      throw new Error('Користувача не знайдено');
    }

    const normalizedEmail = newEmail.trim().toLowerCase();

    if (normalizedEmail !== user.email) {
      const exists = await userRepo.findByEmail(normalizedEmail);
      if (exists) {
        throw new Error('Email вже використовується');
      }
    }

    user.email = normalizedEmail;
    await user.save();

    await this.markUsed(token);

    return mapUserToResponse(user);
  },

  async activateAccount(token: TokenDocument) {
    if (token.type !== TokenType.VERIFICATION) {
      throw new Error('Невірний тип токена');
    }

    const user = await userRepo.findById(token.userId.toString());
    if (!user) {
      throw new Error('Користувача не знайдено');
    }

    user.isActive = true;
    await user.save();

    await this.markUsed(token);

    await ensureUserClient(user);

    return mapUserToResponse(user);
  },
};
