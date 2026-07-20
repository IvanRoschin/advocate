// token.meta.ts
import { TokenType } from './token.enums';

interface BaseTokenMeta extends Record<string, unknown> {
  createdBy?: string;
}

interface VerificationTokenMeta extends BaseTokenMeta {
  plainPassword: string;
}

interface ResetPasswordMeta extends BaseTokenMeta {
  plainPassword: string;
}

interface PasswordRestoreMeta extends BaseTokenMeta {
  plainPassword: string;
}

type TokenMetaByType = {
  [TokenType.VERIFICATION]: VerificationTokenMeta;
  // future:
  [TokenType.RESET_PASSWORD]: ResetPasswordMeta;
  [TokenType.PASSWORD_RESTORE]: PasswordRestoreMeta;

  // [TokenType.INVITE]: InviteMeta;
};

export type TokenMeta<T extends TokenType = TokenType> =
  T extends keyof TokenMetaByType ? TokenMetaByType[T] : BaseTokenMeta;
