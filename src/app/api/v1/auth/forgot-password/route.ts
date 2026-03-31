import { NextResponse } from 'next/server';

import { dbConnect } from '@/app/lib/server/mongoose';
import { authService } from '@/app/lib/services/auth.service';

export async function POST(req: Request) {
  try {
    await dbConnect();

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

    const result = await authService.requestPasswordReset(email);

    return NextResponse.json(result, {
      status: result.ok ? 200 : 404,
    });
  } catch (error) {
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
