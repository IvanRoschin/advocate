'use server';

import { routes } from '@/app/config/routes';
import { tokenRepo } from '@/app/lib/repositories/token.repo';
import { userRepo } from '@/app/lib/repositories/user.repo';
import { env } from '@/app/lib/server/env/serverEnv';
import { sendEmail } from '@/app/lib/server/mail/emailService';
import { EmailTemplateType } from '@/app/templates/email/types';
import { TokenType, UserRole } from '@/app/types';

import { generatePassword } from '../helpers';
import { createAction } from './createAction';

type RegisterInput = { name: string; phone: string; email: string };
type RegisterResult =
  | { ok: true; code: 'EMAIL_SENT'; message: string }
  | { ok: false; code: 'ALREADY_REGISTERED'; message: string };

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

    const temporaryPassword = generatePassword();

    // Юзер вже лишав заявку раніше, але не підтвердив email — оновлюємо
    // дані й пароль замість створення дубля (email унікальний у схемі).
    const user = existing
      ? Object.assign(existing, {
          name: args.name.trim(),
          phone: args.phone.trim(),
          password: temporaryPassword,
        })
      : await userRepo.create({
          name: args.name.trim(),
          email: normalizedEmail,
          phone: args.phone.trim(),
          password: temporaryPassword,
          role: UserRole.CLIENT,
          isActive: false,
        });

    if (existing) {
      await user.save();
    }

    const tokenDoc = await tokenRepo.create({
      userId: user._id,
      type: TokenType.VERIFICATION,
      email: user.email,
    });

    const verificationUrl = `${env.baseUrl}${routes.public.auth.verifyEmail}?token=${tokenDoc.token}`;

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

    return {
      ok: true,
      code: 'EMAIL_SENT' as const,
      message: 'Лист із тимчасовим паролем надіслано.',
    };
  }
);
