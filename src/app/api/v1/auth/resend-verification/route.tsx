import { NextResponse } from 'next/server';

import { requestPasswordReset } from '@/app/actions/auth.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email обовʼязковий' },
        { status: 400 }
      );
    }

    await requestPasswordReset({ email });

    return NextResponse.json({
      success: true,
      message: 'Лист повторно надіслано',
    });
  } catch (err) {
    return errorToResponse(err);
  }
}
