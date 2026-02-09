import { Types } from 'mongoose';

import { baseUrl, routes } from '@/app/config';
import { tokenRepo } from '@/app/lib/repositories/token.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { sendEmail } from '@/app/lib/server/mail/emailService';
import { TokenDocument } from '@/app/models/Token';
import { EmailTemplateType } from '@/app/templates/email/types';
import { CreateTokenDTO, TokenType } from '@/app/types';
import User from '@/models/User';
import crypto from 'crypto';

export const tokenService = {
  async generateTokenString(len = 32) {
    return crypto.randomBytes(len).toString('hex');
  },

  async create(data: CreateTokenDTO) {
    const token = await this.generateTokenString();

    const ttlDefault: Record<TokenType, number> = {
      [TokenType.REFRESH]: 60 * 60 * 24 * 30,
      [TokenType.VERIFICATION]: 60 * 60 * 24,
      [TokenType.PASSWORD_RESET]: 60 * 60 * 2,
      [TokenType.EMAIL_CHANGE]: 60 * 60,
    };

    const expiresAt = new Date(
      Date.now() +
        1000 * (data.ttlSeconds ?? ttlDefault[data.type ?? TokenType.REFRESH])
    );

    return tokenRepo.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
      token,
      used: false,
      expiresAt,
    });
  },

  async verify(tokenValue: string) {
    const tokenDoc = await tokenRepo.findValid(tokenValue);
    if (!tokenDoc) return null;

    await tokenRepo.markUsed(tokenDoc);
    return tokenDoc;
  },

  async activateAccount(tokenDoc: TokenDocument) {
    const user = await User.findById(tokenDoc.userId);
    if (!user) throw new ValidationError('User not found');
    if (user.isActive) throw new ValidationError('Account already active');

    const { generateRandomPassword } = await import('@/lib');
    const tempPassword = generateRandomPassword();

    user.setPassword(tempPassword);
    user.isActive = true;
    await user.save();

    if (!user.email) {
      throw new ValidationError('User has no email');
    }

    await sendEmail({
      to: user.email,
      type: EmailTemplateType.USER_CREDENTIALS,
      props: {
        name: user.name,
        login: user.email,
        password: tempPassword,
        resetPasswordUrl: `${baseUrl}${routes.client.changePassword}`,
      },
    });

    return user;
  },

  async changeEmail(tokenDoc: TokenDocument) {
    const user = await User.findById(tokenDoc.userId);
    if (!user) throw new ValidationError('User not found');
    if (!tokenDoc.email) throw new ValidationError('Token has no email');

    user.email = tokenDoc.email;
    await user.save();

    await sendEmail({
      to: user.email,
      type: EmailTemplateType.EMAIL_CHANGE,
      props: {
        name: user.name,
        email: user.email,
        verificationUrl: `${baseUrl}${routes.public.auth.verifyEmail}?token=${encodeURIComponent(tokenDoc.token)}`,
      },
    });

    return user;
  },
};
