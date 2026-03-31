import { routes } from '@/app/config';
import { sendEmail } from '@/app/lib';
import { userRepo } from '@/app/lib/repositories/user.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { tokenService } from '@/app/lib/services/token.service';
import { EmailTemplateType } from '@/app/templates/email';
import { TokenType } from '@/app/types';

export const authService = {
  async requestPasswordReset(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepo.findByEmail(normalizedEmail);

    if (!user) {
      return {
        ok: false,
        code: 'USER_NOT_FOUND',
        message: 'Користувача з таким email не знайдено.',
      };
    }

    const tokenDoc = await tokenService.create({
      userId: user._id.toString(),
      type: TokenType.PASSWORD_RESET,
      email: user.email,
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL;

    if (!baseUrl) {
      throw new ValidationError('Не налаштовано базовий URL застосунку');
    }

    const resetPasswordUrl = `${baseUrl}${routes.public.auth.restorePassword}?token=${tokenDoc.token}`;

    await sendEmail({
      to: user.email,
      type: EmailTemplateType.RESET_PASSWORD,
      props: {
        name: user.name,
        resetLink: resetPasswordUrl,
      },
    });

    return {
      ok: true,
      code: 'EMAIL_SENT',
      message: 'Інструкції для відновлення пароля надіслано на email.',
    };
  },

  async resetPassword(tokenValue: string, newPassword: string) {
    const token = await tokenService.verify(
      tokenValue,
      TokenType.PASSWORD_RESET
    );

    const user = await userRepo.findById(token.userId.toString());
    if (!user) {
      throw new ValidationError('Користувача не знайдено');
    }

    user.password = newPassword;
    await user.save();

    await tokenService.markUsed(token);

    return { ok: true };
  },
};
