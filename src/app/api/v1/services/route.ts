import { NextResponse } from 'next/server';

import { servicePublicActions } from '@/app/actions/service.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ServiceListItemDto } from '@/app/types';

import type { ApiResponse } from '@/app/lib/server/ApiError';
type ServicesListData = {
  items: ServiceListItemDto[];
  hasMore: boolean;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.max(1, Number(searchParams.get('limit') ?? 6));
    const categorySlug = searchParams.get('category') ?? undefined;

    const result = await servicePublicActions.list({
      page,
      limit,
      categorySlug,
    });

    return NextResponse.json<ApiResponse<ServicesListData>>({
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
