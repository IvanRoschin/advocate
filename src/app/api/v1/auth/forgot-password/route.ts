import { NextResponse } from 'next/server';

import { requestPasswordReset } from '@/app/actions/auth.actions';
import { TooManyRequestsError } from '@/app/lib/server/errors/httpErrors';
import { assertRateLimit } from '@/app/lib/server/rateLimit';

const RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = body?.email?.trim();

    if (!email) {
      return NextResponse.json(
        {
          ok: false,
          code: 'VALIDATION_ERROR',
          message: 'Email є обовʼязковим',
        },
        { status: 400 }
      );
    }

    assertRateLimit(`forgot-password:${email.toLowerCase()}`, RATE_LIMIT);

    const result = await requestPasswordReset({ email });

    return NextResponse.json(result, {
      status: result.ok ? 200 : 404,
    });
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

    console.error('[FORGOT_PASSWORD_ROUTE_ERROR]', error);

    return NextResponse.json(
      {
        ok: false,
        code: 'EMAIL_SEND_ERROR',
        message: 'Не вдалося надіслати лист. Спробуйте пізніше.',
      },
      { status: 500 }
    );
  }
}
