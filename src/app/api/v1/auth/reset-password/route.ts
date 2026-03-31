import { NextResponse } from 'next/server';

import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';
import { authService } from '@/app/lib/services/auth.service';

type ResetPasswordRequestDTO = {
  token?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = (await req.json()) as ResetPasswordRequestDTO;

    const token = body?.token?.trim();
    const password = body?.password;

    if (!token || !password) {
      return NextResponse.json(
        {
          ok: false,
          code: 'VALIDATION_ERROR',
          message: 'Токен та пароль є обовʼязковими',
        },
        { status: 400 }
      );
    }

    const result = await authService.resetPassword(token, password);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[RESET_PASSWORD_ROUTE_ERROR]', error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          ok: false,
          code: 'INVALID_TOKEN',
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Не вдалося змінити пароль. Спробуйте пізніше.',
      },
      { status: 500 }
    );
  }
}
