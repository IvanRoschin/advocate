'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/config/authOptions';

import {
  ChangeOwnPasswordResult,
  changeOwnPasswordLogic,
  requestPasswordResetLogic,
  RequestResetInput,
  RequestResetResult,
  ResetPasswordInput,
  resetPasswordLogic,
  ResetPasswordResult,
} from './auth.logic';
import { createAction } from './createAction';

type PublicRequestResetInput = RequestResetInput & {
  website?: string;
  turnstileToken?: string;
};

export const requestPasswordReset = createAction<
  PublicRequestResetInput,
  RequestResetResult
>(async ({ args }) => requestPasswordResetLogic(args));

export const resetPassword = createAction<
  ResetPasswordInput,
  ResetPasswordResult
>(async ({ args }) => resetPasswordLogic(args));

type ChangeOwnPasswordFormInput = {
  oldPassword: string;
  newPassword: string;
};

/**
 * Змінює пароль поточного авторизованого користувача.
 * userId навмисно береться із серверної сесії, а не з клієнтського інпуту,
 * щоб авторизований користувач не міг підмінити чужий userId у запиті.
 */
export const changeOwnPassword = createAction<
  ChangeOwnPasswordFormInput,
  ChangeOwnPasswordResult
>(async ({ args }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return {
      ok: false,
      code: 'USER_NOT_FOUND' as const,
      message: 'Неавторизований користувач.',
    };
  }

  return changeOwnPasswordLogic({
    userId,
    oldPassword: args.oldPassword,
    newPassword: args.newPassword,
  });
});
