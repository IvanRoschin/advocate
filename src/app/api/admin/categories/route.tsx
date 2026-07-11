import { NextResponse } from 'next/server';

import { categoryActions } from '@/app/actions/category.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { CreateCategoryRequestDTO } from '@/app/types';

export async function POST(request: Request) {
  try {
    const payload: CreateCategoryRequestDTO = await request.json();

    const newCategory = await categoryActions.create(payload);

    return NextResponse.json({ ok: true, data: newCategory });
  } catch (err) {
    return errorToResponse(err);
  }
}
