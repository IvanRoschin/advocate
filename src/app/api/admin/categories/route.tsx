import { NextResponse } from 'next/server';

import { categoryActions } from '@/app/actions/category.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { createCategorySchema, CreateCategoryRequestDTO } from '@/app/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validated = await createCategorySchema.validate(body, {
      abortEarly: false,
    });

    const newCategory = await categoryActions.create(
      validated as CreateCategoryRequestDTO
    );

    return NextResponse.json({ ok: true, data: newCategory }, { status: 201 });
  } catch (err) {
    return errorToResponse(err);
  }
}
