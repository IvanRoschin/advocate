import { NextResponse } from 'next/server';

import { resetPassword } from '@/app/actions/auth.actions';
import {
  TooManyRequestsError,
  ValidationError,
} from '@/app/lib/server/errors/httpErrors';
import { assertRateLimit, getClientIp } from '@/app/lib/server/rateLimit';

type ResetPasswordRequestDTO = {
  token?: string;
  password?: string;
};

// Keyed by IP rather than the (attacker-supplied) token, since the whole
// point is to slow down guessing/brute-forcing the token itself.
const RATE_LIMIT = { limit: 20, windowMs: 60 * 60 * 1000 };

export async function POST(req: Request) {
  try {
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

    const ip = await getClientIp();
    assertRateLimit(`reset-password:${ip}`, RATE_LIMIT);

    const result = await resetPassword({
      token,
      newPassword: password,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof TooManyRequestsError) {
      return NextResponse.json(
        {
          ok: false,
          code: 'TOO_MANY_REQUESTS',
          message: 'Забагато спроб. Спробуйте пізніше.',
        },
        { status: 429 }
      );
    }

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
