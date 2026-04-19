import mongoose from 'mongoose';

import { IconName } from '@/app/resources';
import { Category } from '@/models';

import { CategoryResponseDTO } from './category.dto';

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
    icon: category.icon,
    createdAt: category.createdAt?.toISOString(),
    updatedAt: category.updatedAt?.toISOString(),
  };
}

export function mapCreateRequestToCategory(dto: CategoryResponseDTO) {
  return {
    _id: dto._id,
    title: dto.title,
    slug: dto.slug,
    src: dto.icon as IconName,
  };
}
