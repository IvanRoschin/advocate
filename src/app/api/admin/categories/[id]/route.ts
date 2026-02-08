import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { connectDB } from '@/app/lib/server/mongoose';
import { categoryService } from '@/app/lib/services/category.service';
import { UpdateCategoryDTO } from '@/app/types';

export async function GET(id: string) {
  try {
    await connectDB();

    const category = await categoryService.getById(id);

    return NextResponse.json({ ok: true, data: category });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PATCH(id: string, payload: UpdateCategoryDTO) {
  try {
    await connectDB();

    const updatedCategory = await categoryService.update(id, payload);

    return NextResponse.json({ ok: true, data: updatedCategory });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function DELETE(id: string) {
  try {
    await connectDB();

    await categoryService.delete(id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorToResponse(err);
  }
}
