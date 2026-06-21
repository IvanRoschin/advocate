import { routes } from '@/app/config/routes';
import { EmailTemplateType } from '@/app/templates/email/types';
import { TokenType } from '@/app/types';
import { userRepo } from '../repositories';
import { env } from '../server/env/serverEnv';
import { ValidationError } from '../server/errors/httpErrors';
import { sendEmail } from '../server/mail/emailService';
import { dbConnect } from '../server/mongoose';
import { tokenService } from './token.service';
import { userService } from './user.service';

export const authService = {
  async requestPasswordReset(email: string) {
    await dbConnect();

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepo.findByEmail(normalizedEmail);

    if (!user) {
      return {
        ok: false,
        code: 'USER_NOT_FOUND',
        message: 'Користувача не знайдено.',
      };
    }

    const tokenDoc = await tokenService.create({
      userId: user._id.toString(),
      type: TokenType.RESET_PASSWORD,
      email: user.email,
    });

    const resetUrl = `${env.baseUrl}${routes.public.auth.restorePassword}?token=${tokenDoc.token}`;

    await sendEmail({
      to: user.email,
      type: EmailTemplateType.RESET_PASSWORD,
      props: {
        name: user.name,
        resetLink: resetUrl,
      },
    });

    return {
      ok: true,
      code: 'EMAIL_SENT',
      message: 'Лист відправлено.',
    };
  },

  async resetPassword(token: string, newPassword: string) {
    await dbConnect();

    const tokenDoc = await tokenService.verify(token, TokenType.RESET_PASSWORD);

    const user = await userRepo.findById(tokenDoc.userId.toString());

    if (!user) {
      throw new ValidationError('Користувача не знайдено');
    }

    await userService.update(user._id.toString(), {
      password: newPassword,
    });

    await tokenService.markUsed(tokenDoc);

    return {
      ok: true,
      message: 'Пароль успішно змінено.',
    };
  },
};
