import { NextResponse } from 'next/server';

import categorySchema, {
  CategoryInput,
} from '@/app/helpers/validation-schemas/category-schema';
import { errorToResponse } from '@/app/lib/server/errors/error-to-response';
import { ValidationError } from '@/app/lib/server/errors/http-errors';
import { connectDB } from '@/app/lib/server/mongoose';
import { Category } from '@/models';

interface Params {
  slug: string;
}

// GET категория по slug
export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    await connectDB();

    const { slug } = params;
    if (!slug) throw new ValidationError('Slug не вказано');

    const category = await Category.findOne({ slug });
    if (!category) throw new ValidationError('Категорія не знайдена');

    return NextResponse.json({ ok: true, data: category.toObject() });
  } catch (err) {
    return errorToResponse(err);
  }
}

// PUT обновление категории по slug
export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    await connectDB();

    const { slug } = params;
    if (!slug) throw new ValidationError('Slug не вказано');

    const body = (await req.json()) as CategoryInput;
    const data = await categorySchema.validate(body, { abortEarly: false });

    // Проверка уникальности slug для других категорий
    const existing = await Category.findOne({
      slug: data.slug,
      _id: { $ne: (await Category.findOne({ slug }))?._id },
    });
    if (existing) throw new ValidationError('Категорія з таким slug вже існує');

    const updatedCategory = await Category.findOneAndUpdate({ slug }, data, {
      new: true,
    });
    if (!updatedCategory) throw new ValidationError('Категорія не знайдена');

    return NextResponse.json({ ok: true, data: updatedCategory.toObject() });
  } catch (err) {
    return errorToResponse(err);
  }
}

// DELETE удаление категории по slug
export async function DELETE(_req: Request, { params }: { params: Params }) {
  try {
    await connectDB();

    const { slug } = params;
    if (!slug) throw new ValidationError('Slug не вказано');

    const deleted = await Category.findOneAndDelete({ slug });
    if (!deleted) throw new ValidationError('Категорія не знайдена');

    return NextResponse.json({ ok: true, data: deleted.toObject() });
  } catch (err) {
    return errorToResponse(err);
  }
}
