import { NextResponse } from 'next/server';

import { subscriberPublicActions } from '@/app/actions/subscriber.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const subscriber = await subscriberPublicActions.activate(id);

    return NextResponse.json({ ok: true, data: subscriber });
  } catch (error) {
    return errorToResponse(error);
  }
}
