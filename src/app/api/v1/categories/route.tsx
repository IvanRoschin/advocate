import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { categoryService } from '@/app/lib/services/category.service';

export async function GET() {
  try {
    await dbConnect();

    const categories = await categoryService.getAll();

    return NextResponse.json({ ok: true, data: categories });
  } catch (err) {
    return errorToResponse(err);
  }
}
