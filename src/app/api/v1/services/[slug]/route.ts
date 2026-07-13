import { NextResponse } from 'next/server';

import { servicePublicActions } from '@/app/actions/service.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const item = await servicePublicActions.findPublishedBySlug({ slug });

    return NextResponse.json({ ok: true, data: item });
  } catch (err) {
    return errorToResponse(err);
  }
}
