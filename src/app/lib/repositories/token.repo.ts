import Token, { TokenDB, TokenDocument } from '@/models/Token';
import { mapUserToResponse, TokenType } from '@/app/types';
import { userRepo } from './user.repo';

export const tokenRepo = {
  async create(data: Partial<TokenDocument>) {
    return Token.create(data);
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
    tokenDoc.used = true;
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

    return user;
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

    return mapUserToResponse(user);
  },
};
