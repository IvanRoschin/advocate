import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { articleService } from '@/app/lib/services/article.service';
import { UpdateArticleDTO, updateArticleSchema } from '@/app/types';

type Params = Promise<{ id: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const article = await articleService.getById(id);

    return NextResponse.json({ ok: true, data: article });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json();

    console.log('body', body);

    const data: UpdateArticleDTO = await updateArticleSchema.validate(body, {
      abortEarly: false,
    });

    const updated = await articleService.update(id, data);

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const deleted = await articleService.delete(id);

    return NextResponse.json({ ok: true, data: deleted });
  } catch (err) {
    return errorToResponse(err);
  }
}
