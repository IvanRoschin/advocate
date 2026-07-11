import { NextResponse } from 'next/server';

import { categoryActions } from '@/app/actions/category.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

export async function GET() {
  try {
    const categories = await categoryActions.getAll();

    return NextResponse.json({ ok: true, data: categories });
  } catch (err) {
    return errorToResponse(err);
  }
}
