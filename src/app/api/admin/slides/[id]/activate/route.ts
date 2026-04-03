import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { slideService } from '@/app/lib/services/slide.service';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const slide = await slideService.activate(id);

    return NextResponse.json({ ok: true, data: slide });
  } catch (err) {
    return errorToResponse(err);
  }
}
