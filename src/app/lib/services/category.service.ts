import slugify from 'slugify';

import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import {
  CreateCategoryRequestDTO,
  mapCategoryToResponse,
  UpdateCategoryDTO,
} from '@/app/types';
import { categoryRepo } from '@/lib/repositories/category.repo';

export const categoryService = {
  async getAll() {
    return categoryRepo.findAll();
  },

  async getById(id: string) {
    const category = await categoryRepo.findById(id);
    if (!category) throw new ValidationError('Категорію не знайдено');
    const dto = mapCategoryToResponse(category);
    return dto;
  },

  async create(data: CreateCategoryRequestDTO) {
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
    const category = await categoryRepo.findById(id);
    if (!category) throw new ValidationError('Категорію не знайдено');

    if (data.slug && data.slug !== category.slug) {
      const exists = await categoryRepo.findBySlug(data.slug);
      if (exists) {
        throw new ValidationError('Категорія з таким slug вже існує');
      }
    }

    Object.assign(category, data);
    await category.save();

    return category;
  },

  async delete(id: string) {
    const deleted = await categoryRepo.delete(id);
    if (!deleted) throw new ValidationError('Категорію не знайдено');
    return deleted;
  },
};
