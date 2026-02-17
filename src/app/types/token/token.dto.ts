import { TokenType } from './token.enums';
import { TokenMeta } from './token.meta';

export interface TokenResponseDTO<T extends TokenType = TokenType> {
  id: string;
  userId: string;
  token: string;
  type: T;
  email?: string;
  used: boolean;
  expiresAt?: Date;
  meta?: TokenMeta<T>;
}

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
