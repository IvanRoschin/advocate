import mongoose from 'mongoose';

import { Category } from '@/models';

import { CategoryResponseDTO, CreateCategoryRequestDTO } from './category.dto';

export function mapCategoryToResponse(
  category: typeof Category extends infer T
    ? T extends mongoose.Model<infer U>
      ? U
      : never
    : never
): CategoryResponseDTO {
  return {
    _id: category._id.toString(),
    title: category.title,
    slug: category.slug,
    src: category.src,
    createdAt: category.createdAt?.toISOString(),
    updatedAt: category.updatedAt?.toISOString(),
  };
}

export function mapCreateRequestToCategory(dto: CreateCategoryRequestDTO) {
  return {
    title: dto.title,
    slug: dto.slug,
    src: dto.src,
  };
}
