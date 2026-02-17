import { dbConnect } from '@/app/lib/server/mongoose';
import { TokenType } from '@/app/types';
import Token, { TokenDB, TokenDocument } from '@/models/Token';

export const tokenRepo = {
  async create(data: Partial<TokenDocument>) {
    await dbConnect();
    return Token.create(data);
  },

  async findValid(token: string, type?: TokenType) {
    await dbConnect();
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
};
