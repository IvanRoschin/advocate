import 'server-only';

import { tokenRepo } from '@/app/lib/repositories/token.repo';
import { CreateTokenDTO, TokenType, UserResponseDTO } from '@/app/types';
import { ValidationError } from '@/lib/server/errors';

import { TokenDocument } from '../models/Token';
import { createAction } from './createAction';

export const tokenActions = {
  create: createAction<CreateTokenDTO, TokenDocument>(async ({ args }) => {
    return tokenRepo.create(args);
  }),

  findValid: createAction<
    { token: string; type?: TokenType },
    TokenDocument | null
  >(async ({ args }) => {
    return tokenRepo.findValid(args.token, args.type);
  }),

  verify: createAction<{ token: string; type?: TokenType }, TokenDocument>(
    async ({ args }) => {
      const tokenDoc = await tokenRepo.findValid(args.token, args.type);

      if (!tokenDoc) {
        throw new ValidationError('Токен недійсний або протермінований');
      }

      return tokenDoc;
    }
  ),

  markUsed: createAction<TokenDocument, void>(async ({ args: tokenDoc }) => {
    await tokenRepo.markUsed(tokenDoc);
  }),

  changeEmail: createAction<TokenDocument, UserResponseDTO>(
    async ({ args: tokenDoc }) => tokenRepo.changeEmail(tokenDoc)
  ),

  activateAccount: createAction<TokenDocument, UserResponseDTO>(
    async ({ args: tokenDoc }) => {
      return tokenRepo.activateAccount(tokenDoc);
    }
  ),
};
