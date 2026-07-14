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

type PublicRegisterInput = RegisterInput & {
  website?: string;
  turnstileToken?: string;
};

type PublicResendInput = ResendVerificationInput & {
  website?: string;
  turnstileToken?: string;
};

export const registerAccount = createAction<
  PublicRegisterInput,
  RegisterResult
>(async ({ args }) => registerAccountLogic(args));

export const resendVerification = createAction<
  PublicResendInput,
  ResendVerificationResult
>(async ({ args }) => resendVerificationLogic(args));
