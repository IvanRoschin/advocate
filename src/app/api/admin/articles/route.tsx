import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { articleService } from '@/app/lib/services/article.service';
import { CreateArticleRequestDTO, createArticleSchema } from '@/app/types';

export async function GET() {
  try {
    await dbConnect();

    const articles = await articleService.getAll();
    return NextResponse.json({ ok: true, data: articles });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const data: CreateArticleRequestDTO = await createArticleSchema.validate(
      body,
      { abortEarly: false }
    );

    const article = await articleService.create(data);

    return NextResponse.json({ ok: true, data: article }, { status: 201 });
  } catch (err) {
    return errorToResponse(err);
  }
}
