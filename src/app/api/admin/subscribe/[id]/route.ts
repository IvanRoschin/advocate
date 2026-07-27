import { NextResponse } from 'next/server';

import { subscriberActions } from '@/app/actions/subscriber.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { UpdateSubscriberDTO, updateSubscriberSchema } from '@/app/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const subscriber = await subscriberActions.getById(id);

    return NextResponse.json({ ok: true, data: subscriber });
  } catch (error) {
    return errorToResponse(error);
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const validated = await updateSubscriberSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const subscriber = await subscriberActions.update(
      id,
      validated as UpdateSubscriberDTO
    );

    return NextResponse.json({ ok: true, data: subscriber });
  } catch (error) {
    return errorToResponse(error);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const result = await subscriberActions.delete(id);

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    return errorToResponse(error);
  }
}
