import { NextResponse } from 'next/server';

import { categoryActions } from '@/app/actions/category.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { mapCategoryToResponse, UpdateCategoryDTO } from '@/app/types';

/* ---------------- GET ---------------- */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await categoryActions.getById(id);

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
    const { id } = await params;
    const payload: UpdateCategoryDTO = await request.json();

    const updatedCategory = await categoryActions.update(id, payload);

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
    const { id } = await params;

    await categoryActions.delete(id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorToResponse(err);
  }
}
