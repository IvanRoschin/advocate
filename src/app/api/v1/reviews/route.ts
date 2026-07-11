import { NextResponse } from 'next/server';
import { ValidationError as YupValidationError } from 'yup';

import { reviewActions } from '@/app/actions/review.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { CreateReviewRequestDTO, createReviewSchema } from '@/app/types';

export async function GET() {
  try {
    const reviews = await reviewActions.getAll();
    return NextResponse.json({ ok: true, data: reviews });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = await createReviewSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const data = validated as CreateReviewRequestDTO;
    const review = await reviewActions.create(data);

    return NextResponse.json({ ok: true, data: review }, { status: 201 });
  } catch (err) {
    if (err instanceof YupValidationError) {
      return errorToResponse(
        new ValidationError(err.errors[0] ?? 'Validation failed', err.errors)
      );
    }

    return errorToResponse(err);
  }
}
