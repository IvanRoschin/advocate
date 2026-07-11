import { NextResponse } from 'next/server';

import { tokenActions } from '@/app/actions/token.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { TokenType, VerifyTokenDTO } from '@/app/types';

export async function POST(req: Request) {
  try {
    const { token }: VerifyTokenDTO = await req.json();

    if (!token?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Токен відсутній' },
        { status: 400 }
      );
    }

    const tokenDoc = await tokenActions.verify({ token: token.trim() });

    if (tokenDoc.type === TokenType.EMAIL_CHANGE) {
      const user = await tokenActions.changeEmail(tokenDoc);

      return NextResponse.json({
        success: true,
        message: 'Email успішно змінено',
        user,
      });
    }

    if (tokenDoc.type === TokenType.VERIFICATION) {
      const user = await tokenActions.activateAccount(tokenDoc);

      return NextResponse.json({
        success: true,
        message: 'Кабінет успішно активовано',
        user,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Невідомий тип токена' },
      { status: 400 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
