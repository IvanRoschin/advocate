import { NextResponse } from 'next/server';

import { slidePublicActions } from '@/app/actions/slide.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const slide = await slidePublicActions.activate(id);

    return NextResponse.json({ ok: true, data: slide });
  } catch (err) {
    return errorToResponse(err);
  }
}
