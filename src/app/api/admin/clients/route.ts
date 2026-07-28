import { NextResponse } from 'next/server';

import { clientActions } from '@/app/actions/client.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { clientFormSchema, CreateClientDTO } from '@/app/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);

    const result = await clientActions.getAll({ page, limit });

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

    const validated = await clientFormSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const client = await clientActions.create(validated as CreateClientDTO);

    return NextResponse.json({ ok: true, data: client }, { status: 201 });
  } catch (err) {
    return errorToResponse(err);
  }
}
