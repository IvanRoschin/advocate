import { NextResponse } from 'next/server';

import { tokenActions } from '@/app/actions/token.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { TokenType, UserResponseDTO, VerifyTokenDTO } from '@/app/types';
import { ValidationError } from '@/lib/server/errors';

import type { ApiResponse } from '@/app/lib/server/ApiError';
type VerifyResultData = {
  message: string;
  user: UserResponseDTO;
};

export async function POST(req: Request) {
  try {
    const { token }: VerifyTokenDTO = await req.json();

    if (!token?.trim()) {
      throw new ValidationError('Токен відсутній');
    }

    const tokenDoc = await tokenActions.verify({ token: token.trim() });

    if (tokenDoc.type === TokenType.EMAIL_CHANGE) {
      const user = await tokenActions.changeEmail(tokenDoc);

      return NextResponse.json<ApiResponse<VerifyResultData>>({
        ok: true,
        data: { message: 'Email успішно змінено', user },
      });
    }

    if (tokenDoc.type === TokenType.VERIFICATION) {
      const user = await tokenActions.activateAccount(tokenDoc);

      return NextResponse.json<ApiResponse<VerifyResultData>>({
        ok: true,
        data: { message: 'Кабінет успішно активовано', user },
      });
    }

    throw new ValidationError('Невідомий тип токена');
  } catch (err) {
    return errorToResponse(err);
  }
}
