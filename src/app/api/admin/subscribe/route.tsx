import { NextResponse } from 'next/server';

import { subscriberPublicActions } from '@/app/actions/subscriber.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { createSubscriberSchema } from '@/app/types'; // предположу, что у вас есть такая схема

export async function GET() {
  try {
    const result = await subscriberPublicActions.list({ limit: 100 });

    return NextResponse.json({ ok: true, data: result });
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
