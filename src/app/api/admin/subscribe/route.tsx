import { NextResponse } from 'next/server';

import {
  subscriberActions,
  subscriberPublicActions,
} from '@/app/actions/subscriber.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { createSubscriberSchema } from '@/app/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);

    const result = await subscriberActions.getAll({ page, limit });

    return NextResponse.json({
      ok: true,
      data: result.items,
      meta: { page, limit, hasMore: result.hasMore },
    });
  } catch (error) {
    return errorToResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = await createSubscriberSchema.validate(body, {
      abortEarly: false,
    });

    const subscriber = await subscriberPublicActions.create(validated);

    return NextResponse.json({ ok: true, data: subscriber }, { status: 201 });
  } catch (error) {
    return errorToResponse(error);
  }
}
