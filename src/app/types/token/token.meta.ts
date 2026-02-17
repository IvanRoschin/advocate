// token.meta.ts
import { TokenType } from './token.enums';

export interface BaseTokenMeta extends Record<string, unknown> {
  createdBy?: string;
}

export interface VerificationTokenMeta extends BaseTokenMeta {
  plainPassword: string;
}

export type TokenMetaByType = {
  [TokenType.VERIFICATION]: VerificationTokenMeta;
  // future:
  // [TokenType.RESET_PASSWORD]: ResetPasswordMeta;
  // [TokenType.INVITE]: InviteMeta;
};

export type TokenMeta<T extends TokenType = TokenType> =
  T extends keyof TokenMetaByType ? TokenMetaByType[T] : BaseTokenMeta;
