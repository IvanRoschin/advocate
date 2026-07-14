import { NextResponse } from 'next/server';

import {
  reviewActions,
  reviewPublicActions,
} from '@/app/actions/review.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ReviewResponseDTO } from '@/app/types';

import type { ApiResponse } from '@/app/lib/server/ApiError';
export async function GET() {
  try {
    const reviews = await reviewActions.getAll();
    return NextResponse.json<ApiResponse<typeof reviews>>({
      ok: true,
      data: reviews,
    });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const review = await reviewPublicActions.create(body);

    return NextResponse.json<ApiResponse<ReviewResponseDTO>>(
      { ok: true, data: review },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
