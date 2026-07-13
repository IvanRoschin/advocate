'use server';

import { createAction } from './createAction';
import {
  registerAccountLogic,
  RegisterInput,
  RegisterResult,
  ResendVerificationInput,
  resendVerificationLogic,
  ResendVerificationResult,
} from './register.logic';

export const registerAccount = createAction<RegisterInput, RegisterResult>(
  async ({ args }) => registerAccountLogic(args)
);

export const resendVerification = createAction<
  ResendVerificationInput,
  ResendVerificationResult
>(async ({ args }) => resendVerificationLogic(args));
