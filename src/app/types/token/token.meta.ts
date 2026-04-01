// token.meta.ts
import { TokenType } from './token.enums';

export interface BaseTokenMeta extends Record<string, unknown> {
  createdBy?: string;
}

export interface VerificationTokenMeta extends BaseTokenMeta {
  plainPassword: string;
}

export interface ResetPasswordMeta extends BaseTokenMeta {
  plainPassword: string;
}

export interface PasswordRestoreMeta extends BaseTokenMeta {
  plainPassword: string;
}

export type TokenMetaByType = {
  [TokenType.VERIFICATION]: VerificationTokenMeta;
  // future:
  [TokenType.RESET_PASSWORD]: ResetPasswordMeta;
  [TokenType.PASSWORD_RESTORE]: PasswordRestoreMeta;

  // [TokenType.INVITE]: InviteMeta;
};

export type TokenMeta<T extends TokenType = TokenType> =
  T extends keyof TokenMetaByType ? TokenMetaByType[T] : BaseTokenMeta;
