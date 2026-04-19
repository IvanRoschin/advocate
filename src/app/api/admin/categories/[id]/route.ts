import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { categoryService } from '@/app/lib/services/category.service';
import { mapCategoryToResponse, UpdateCategoryDTO } from '@/app/types';

/* ---------------- GET ---------------- */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const category = await categoryService.getById(id);

    return NextResponse.json({ ok: true, data: category });
  } catch (err) {
    return errorToResponse(err);
  }
}

/* ---------------- PATCH ---------------- */

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const payload: UpdateCategoryDTO = await request.json();

    const updatedCategory = await categoryService.update(id, payload);

    return NextResponse.json({
      ok: true,
      data: mapCategoryToResponse(updatedCategory),
    });
  } catch (err) {
    return errorToResponse(err);
  }
}

/* ---------------- DELETE ---------------- */

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    await categoryService.delete(id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorToResponse(err);
  }
}
