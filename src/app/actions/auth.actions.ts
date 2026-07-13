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

export const requestPasswordReset = createAction<
  RequestResetInput,
  RequestResetResult
>(async ({ args }) => requestPasswordResetLogic(args));

export const resetPassword = createAction<
  ResetPasswordInput,
  ResetPasswordResult
>(async ({ args }) => resetPasswordLogic(args));
