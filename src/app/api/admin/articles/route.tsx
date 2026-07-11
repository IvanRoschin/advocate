import { NextResponse } from 'next/server';

import { articleActions } from '@/app/actions/article.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { CreateArticleRequestDTO, createArticleSchema } from '@/app/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 5);

    const result = await articleActions.getAll({ page, limit });

    return NextResponse.json({
      ok: true,
      data: result.items,
      meta: { page, limit, hasMore: result.hasMore },
    });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data: CreateArticleRequestDTO = await createArticleSchema.validate(
      body,
      { abortEarly: false }
    );

    const article = await articleActions.create(data);

    return NextResponse.json({ ok: true, data: article }, { status: 201 });
  } catch (err) {
    return errorToResponse(err);
  }
}
