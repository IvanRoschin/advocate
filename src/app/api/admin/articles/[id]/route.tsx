import { NextResponse } from 'next/server';

import { articleActions } from '@/app/actions/article.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { UpdateArticleDTO, updateArticleSchema } from '@/app/types';

type Params = Promise<{ id: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const article = await articleActions.getById(id);

    return NextResponse.json({ ok: true, data: article });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data: UpdateArticleDTO = await updateArticleSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const patch = {
      ...data,
      src: data.src ?? undefined,
    };

    const updated = await articleActions.update(id, patch);

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const deleted = await articleActions.delete(id);

    return NextResponse.json({ ok: true, data: deleted });
  } catch (err) {
    return errorToResponse(err);
  }
}
