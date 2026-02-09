import { TokenType } from './token.enums';

export interface TokenResponseDTO {
  id: string;
  userId: string;
  token: string;
  type: TokenType;
  email?: string;
  used: boolean;
  expiresAt?: Date;
}

export interface CreateTokenDTO {
  userId: string;
  type?: TokenType;
  email?: string;
  ttlSeconds?: number;
}

export interface VerifyTokenDTO {
  token: string;
}
