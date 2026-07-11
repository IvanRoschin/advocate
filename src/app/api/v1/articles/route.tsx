import { NextResponse } from 'next/server';

import { articlePublicActions } from '@/app/actions/article.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.max(1, Number(searchParams.get('limit') ?? 5));
    const categorySlug = searchParams.get('category') ?? undefined;

    const result = await articlePublicActions.list({
      page,
      limit,
      categorySlug,
    });

    return NextResponse.json({
      ok: true,
      data: result.items,
      meta: { page, limit, hasMore: result.hasMore },
    });
  } catch (err) {
    return errorToResponse(err);
  }
}
