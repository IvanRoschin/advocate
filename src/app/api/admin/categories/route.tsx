import { NextResponse } from 'next/server';

import { Category } from '@/models';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { connectDB } from '@/app/lib/server/mongoose';
import { CreateCategoryRequestDTO, createCategorySchema } from '@/app/types';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as CreateCategoryRequestDTO;

    const data = await createCategorySchema.validate(body, {
      abortEarly: false,
    });

    const category = await Category.create(data);

    return NextResponse.json(
      { ok: true, data: category.toObject() },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
