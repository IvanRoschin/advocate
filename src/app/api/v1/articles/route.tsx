import { NextResponse } from 'next/server';

import { articlePublicActions } from '@/app/actions/article.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import type { ApiResponse } from '@/app/lib/server/ApiError';
import { ArticleListItemDto } from '@/app/types';

type ArticlesListData = {
  items: ArticleListItemDto[];
  hasMore: boolean;
};

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

    return NextResponse.json<ApiResponse<ArticlesListData>>({
      ok: true,
      data: {
        items: result.items,
        hasMore: result.hasMore,
      },
    });
  } catch (err) {
    return errorToResponse(err);
  }
}
