import { NextResponse } from 'next/server';

import categorySchema, {
  CategoryInput,
} from '@/app/helpers/validation-schemas/category-schema';
import { errorToResponse } from '@/app/lib/server/errors/error-to-response';
import { connectDB } from '@/app/lib/server/mongoose';
import { Category, CategoryDocument } from '@/models';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as CategoryInput;

    // Валидация через Yup
    const data = await categorySchema.validate(body, { abortEarly: false });

    const category = await Category.create(data);

    return NextResponse.json(
      { ok: true, data: category.toObject() },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function GET() {
  try {
    await connectDB();

    const categories: CategoryDocument[] = await Category.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(
      { ok: true, data: categories ?? [] },
      {
        status: 200,
        headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' },
      }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
