'use server';

import {
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
