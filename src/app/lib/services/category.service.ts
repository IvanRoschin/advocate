import slugify from 'slugify';

import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import {
  CreateCategoryRequestDTO,
  mapCategoryToResponse,
  UpdateCategoryDTO,
} from '@/app/types';
import { categoryRepo } from '@/lib/repositories/category.repo';

import { dbConnect } from '../server/mongoose';

export const categoryService = {
  async getAll() {
    await dbConnect();
    return categoryRepo.findAll();
  },

  async getById(id: string) {
    await dbConnect();

    const category = await categoryRepo.findById(id);
    if (!category) throw new ValidationError('Категорію не знайдено');
    const dto = mapCategoryToResponse(category);
    return dto;
  },

  async create(data: CreateCategoryRequestDTO) {
    await dbConnect();

    const slug = slugify(data.title, {
      lower: true,
      strict: true,
      locale: 'uk',
      trim: true,
    });

    const existing = await categoryRepo.findBySlug(slug);
    if (existing) {
      throw new ValidationError('Категорія з таким slug вже існує');
    }

    const category = await categoryRepo.create({
      ...data,
      slug,
    });

    return category;
  },

  async update(id: string, data: UpdateCategoryDTO) {
    await dbConnect();

    const category = await categoryRepo.findById(id);
    if (!category) {
      throw new ValidationError('Категорію не знайдено');
    }

    let nextSlug = category.slug;

    // 1️⃣ Явно передан slug
    if (data.slug && data.slug !== category.slug) {
      nextSlug = data.slug;
    }

    // 2️⃣ Slug не передан, но изменился title
    if (!data.slug && data.title && data.title !== category.title) {
      nextSlug = slugify(data.title, {
        lower: true,
        strict: true,
        locale: 'uk',
        trim: true,
      });
    }

    // 3️⃣ Проверка уникальности (если slug реально меняется)
    if (nextSlug !== category.slug) {
      const exists = await categoryRepo.findBySlug(nextSlug);

      if (exists && exists.id !== category.id) {
        throw new ValidationError('Категорія з таким slug вже існує');
      }
    }

    // 4️⃣ Применяем изменения
    Object.assign(category, {
      ...data,
      slug: nextSlug,
    });

    await category.save();
    return category;
  },

  async delete(id: string) {
    await dbConnect();

    const deleted = await categoryRepo.delete(id);
    if (!deleted) throw new ValidationError('Категорію не знайдено');
    return deleted;
  },
};
