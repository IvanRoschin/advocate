import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { categoryService } from '@/app/lib/services/category.service';
import { CreateCategoryRequestDTO } from '@/app/types';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const payload: CreateCategoryRequestDTO = await request.json();

    const newCategory = await categoryService.create(payload);

    return NextResponse.json({ ok: true, data: newCategory });
  } catch (err) {
    return errorToResponse(err);
  }
}
