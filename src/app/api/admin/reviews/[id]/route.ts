import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { reviewService } from '@/app/lib/services/review.service';
import { UpdateReviewDTO, updateReviewSchema } from '@/app/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const review = await reviewService.getById(id);

    return NextResponse.json({ ok: true, data: review });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const validated = await updateReviewSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const data = Object.fromEntries(
      Object.entries(validated as Record<string, unknown>).filter(
        ([, value]) => value !== undefined
      )
    ) as UpdateReviewDTO;

    const review = await reviewService.update(id, data);

    return NextResponse.json({ ok: true, data: review });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await reviewService.delete(id);

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    return errorToResponse(err);
  }
}
