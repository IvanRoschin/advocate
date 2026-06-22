'use server';

import { routes } from '@/app/config/routes';
import { userRepo } from '@/app/lib/repositories/user.repo';
import { env } from '@/app/lib/server/env/serverEnv';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { sendEmail } from '@/app/lib/server/mail/emailService';
import { dbConnect } from '@/app/lib/server/mongoose';
import { tokenService } from '@/app/lib/services/token.service';
import { EmailTemplateType } from '@/app/templates/email/types';
import { TokenType } from '@/app/types';

/* =========================================================
   REQUEST PASSWORD RESET
   ========================================================= */

export async function requestPasswordReset(email: string) {
  await dbConnect();

  const normalizedEmail = email.trim().toLowerCase();

  const user = await userRepo.findByEmail(normalizedEmail);

  // ⚠️ intentionally non-verbose for security reasons
  if (!user) {
    return {
      ok: false,
      code: 'USER_NOT_FOUND' as const,
      message: 'Користувача не знайдено.',
    };
  }

  const tokenDoc = await tokenService.create({
    userId: user._id.toString(),
    type: TokenType.RESET_PASSWORD,
    email: user.email,
  });

  const resetUrl = `${env.baseUrl}${
    routes.public.auth.restorePassword
  }?token=${tokenDoc.token}`;

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
    code: 'EMAIL_SENT' as const,
    message: 'Лист відправлено.',
  };
}

/* =========================================================
   RESET PASSWORD
   ========================================================= */

export async function resetPassword(token: string, newPassword: string) {
  await dbConnect();

  const tokenDoc = await tokenService.verify(token, TokenType.RESET_PASSWORD);

  const user = await userRepo.findById(tokenDoc.userId.toString());

  if (!user) {
    throw new ValidationError('Користувача не знайдено');
  }

  // ⚠️ intentionally delegated to repo/service boundary
  user.password = newPassword;
  await user.save();

  await tokenService.markUsed(tokenDoc);

  return {
    ok: true,
    message: 'Пароль успішно змінено.',
  };
}
