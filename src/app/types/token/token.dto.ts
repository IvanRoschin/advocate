import { TokenType } from './token.enums';
import { TokenMeta } from './token.meta';

export interface CreateTokenDTO<T extends TokenType = TokenType> {
  userId: string;
  type?: T;
  email?: string;
  ttlSeconds?: number;
  meta?: TokenMeta<T>;
}

export interface VerifyTokenDTO {
  token: string;
}
