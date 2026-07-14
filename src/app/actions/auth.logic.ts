import 'server-only';

import { routes } from '@/app/config/routes';
import { tokenRepo } from '@/app/lib/repositories/token.repo';
import { userRepo } from '@/app/lib/repositories/user.repo';
import { serverEnv } from '@/app/lib/server/env/serverEnv';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { sendEmail } from '@/app/lib/server/mail/emailService';
import { EmailTemplateType } from '@/app/templates/email/types';
import { TokenType } from '@/app/types';

import { toIdString } from '../lib/mappers/_utils';

export type RequestResetInput = { email: string };
export type RequestResetResult =
  | { ok: true; code: 'EMAIL_SENT'; message: string }
  | { ok: false; code: 'USER_NOT_FOUND'; message: string };

export type ResetPasswordInput = { token: string; newPassword: string };
export type ResetPasswordResult = { ok: true; message: string };

export async function requestPasswordResetLogic(
  args: RequestResetInput
): Promise<RequestResetResult> {
  const normalizedEmail = args.email.trim().toLowerCase();
  const user = await userRepo.findByEmail(normalizedEmail);

  if (!user) {
    return {
      ok: false,
      code: 'USER_NOT_FOUND' as const,
      message: 'Користувача не знайдено.',
    };
  }

  const tokenDoc = await tokenRepo.create({
    userId: toIdString(user._id),
    type: TokenType.RESET_PASSWORD,
    email: user.email,
  });

  const resetUrl = `${serverEnv.baseUrl}${routes.public.auth.restorePassword}?token=${tokenDoc.token}`;

  await sendEmail({
    to: user.email,
    type: EmailTemplateType.RESET_PASSWORD,
    props: { name: user.name, resetLink: resetUrl },
  });

  return {
    ok: true,
    code: 'EMAIL_SENT' as const,
    message: 'Лист відправлено.',
  };
}

export async function resetPasswordLogic(
  args: ResetPasswordInput
): Promise<ResetPasswordResult> {
  const tokenDoc = await tokenRepo.findValid(
    args.token,
    TokenType.RESET_PASSWORD
  );

  if (!tokenDoc) {
    throw new ValidationError('Токен недійсний або застарів.');
  }

  const user = await userRepo.findById(tokenDoc.userId.toString());

  if (!user) {
    throw new ValidationError('Користувача не знайдено.');
  }

  user.password = args.newPassword;
  await user.save();

  await tokenRepo.markUsed(tokenDoc);

  return { ok: true, message: 'Пароль успішно змінено.' };
}
