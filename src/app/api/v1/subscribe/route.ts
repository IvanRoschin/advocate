import { NextResponse } from 'next/server';

import { subscriberPublicActions } from '@/app/actions/subscriber.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

import type { ApiResponse } from '@/app/lib/server/ApiError';
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const subscriber = await subscriberPublicActions.create(body);

    return NextResponse.json<ApiResponse<typeof subscriber>>(
      { ok: true, data: subscriber },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
