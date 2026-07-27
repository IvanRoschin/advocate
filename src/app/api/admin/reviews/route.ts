import { NextResponse } from 'next/server';

import { reviewActions } from '@/app/actions/review.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);

    const result = await reviewActions.getAll({ page, limit });

    return NextResponse.json({
      ok: true,
      data: result.items,
      meta: { page, limit, hasMore: result.hasMore },
    });
  } catch (err) {
    return errorToResponse(err);
  }
}
