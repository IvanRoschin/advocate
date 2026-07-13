import { NextResponse } from 'next/server';

import { subscriberActions } from '@/app/actions/subscriber.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const subscriber = await subscriberActions.getById(id); // если есть в actions

    if (!subscriber) {
      return NextResponse.json(
        { message: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: subscriber });
  } catch (error) {
    return errorToResponse(error);
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Если нужно валидировать обновление — добавьте схему
    const subscriber = await subscriberActions.update(id, body);

    if (!subscriber) {
      return NextResponse.json(
        { message: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: subscriber });
  } catch (error) {
    return errorToResponse(error);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const result = await subscriberActions.delete(id);

    if (!result) {
      return NextResponse.json(
        { message: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorToResponse(error);
  }
}
