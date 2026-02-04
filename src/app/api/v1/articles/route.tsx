import { NextResponse } from 'next/server';

import { articleSchema } from '@/app/helpers/validationSchemas';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { connectDB } from '@/app/lib/server/mongoose';
import { Article, ArticleInput } from '@/models';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as ArticleInput;

    // Валидация через Yup
    const data = await articleSchema.validate(body, {
      abortEarly: false,
    });

    const article = await Article.create(data);

    return NextResponse.json(
      { ok: true, data: article.toObject() },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
