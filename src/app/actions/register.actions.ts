'use server';

import { HydratedDocument } from 'mongoose';

import { routes } from '@/app/config/routes';
import { tokenRepo } from '@/app/lib/repositories/token.repo';
import { userRepo } from '@/app/lib/repositories/user.repo';
import { env } from '@/app/lib/server/env/serverEnv';
import { sendEmail } from '@/app/lib/server/mail/emailService';
import { EmailTemplateType } from '@/app/templates/email/types';
import { TokenType, UserRole } from '@/app/types';

import { generatePassword } from '../helpers';
import { toIdString } from '../lib/mappers/_utils';
import { createAction } from './createAction';

import type { UserDocument } from '@/models/User';
type RegisterInput = { name: string; phone: string; email: string };
type RegisterResult =
  | { ok: true; code: 'EMAIL_SENT'; message: string }
  | { ok: false; code: 'ALREADY_REGISTERED'; message: string };

type ResendVerificationInput = { email: string };
type ResendVerificationResult =
  | { ok: true; code: 'EMAIL_SENT'; message: string }
  | { ok: false; code: 'USER_NOT_FOUND'; message: string }
  | { ok: false; code: 'ALREADY_ACTIVATED'; message: string };

/* =========================================================
   SHARED: видати новий тимчасовий пароль + VERIFICATION-токен
   ======================================================== */

async function issueActivationEmail(user: HydratedDocument<UserDocument>) {
  const temporaryPassword = generatePassword();
  user.password = temporaryPassword;
  await user.save();

  const tokenDoc = await tokenRepo.create({
    userId: toIdString(user._id),
    type: TokenType.VERIFICATION,
    email: user.email,
  });

  const verificationUrl = `${env.baseUrl}${routes.public.auth.verifyEmail}?token=${tokenDoc.token}&email=${encodeURIComponent(user.email)}`;

  await sendEmail({
    to: user.email,
    type: EmailTemplateType.ACTIVATE_USER_ACCOUNT,
    props: {
      name: user.name,
      email: user.email,
      temporaryPassword,
      verificationUrl,
    },
  });
}

/* =========================================================
   REGISTER ACCOUNT
   ======================================================== */

export const registerAccount = createAction<RegisterInput, RegisterResult>(
  async ({ args }) => {
    const normalizedEmail = args.email.trim().toLowerCase();
    const existing = await userRepo.findByEmail(normalizedEmail);

    if (existing?.isActive) {
      return {
        ok: false,
        code: 'ALREADY_REGISTERED' as const,
        message: 'Ви вже зареєстровані. Увійдіть у кабінет.',
      };
    }

    const user = existing
      ? Object.assign(existing, {
          name: args.name.trim(),
          phone: args.phone.trim(),
        })
      : await userRepo.create({
          name: args.name.trim(),
          email: normalizedEmail,
          phone: args.phone.trim(),
          role: UserRole.CLIENT,
          isActive: false,
        });

    await issueActivationEmail(user);

    return {
      ok: true,
      code: 'EMAIL_SENT' as const,
      message: 'Лист із тимчасовим паролем надіслано.',
    };
  }
);

/* =========================================================
   RESEND VERIFICATION
   ======================================================== */

export const resendVerification = createAction<
  ResendVerificationInput,
  ResendVerificationResult
>(async ({ args }) => {
  const normalizedEmail = args.email.trim().toLowerCase();
  const user = await userRepo.findByEmail(normalizedEmail);

  if (!user) {
    return {
      ok: false,
      code: 'USER_NOT_FOUND' as const,
      message: 'Користувача з таким email не знайдено.',
    };
  }

  if (user.isActive) {
    return {
      ok: false,
      code: 'ALREADY_ACTIVATED' as const,
      message: 'Кабінет вже активовано. Увійдіть, використовуючи свій пароль.',
    };
  }

  await issueActivationEmail(user);

  return {
    ok: true,
    code: 'EMAIL_SENT' as const,
    message: 'Лист надіслано повторно.',
  };
});
