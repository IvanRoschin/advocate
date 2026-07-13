import { NextResponse } from 'next/server';

import { resendVerification } from '@/app/actions/register.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ValidationError } from '@/lib/server/errors';

import type { ApiResponse } from '@/app/lib/server/ApiError';
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      throw new ValidationError("Email обов'язковий");
    }

    const result = await resendVerification({ email });

    if (!result.ok) {
      throw new ValidationError(result.message);
    }

    return NextResponse.json<ApiResponse<{ message: string }>>({
      ok: true,
      data: { message: result.message },
    });
  } catch (err) {
    return errorToResponse(err);
  }
}
