import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { userService } from '@/app/lib/services/user.service';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email обовʼязковий' },
        { status: 400 }
      );
    }

    await userService.resendVerificationEmail(email);

    return NextResponse.json({
      success: true,
      message: 'Лист повторно надіслано',
    });
  } catch (err) {
    return errorToResponse(err);
  }
}
