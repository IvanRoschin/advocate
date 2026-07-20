import mongoose, { Types } from 'mongoose';

import { Category } from '@/models';

import { BlogCategoryItemDto } from '../article';
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

export type CategoryCountRow = {
  categoryId: Types.ObjectId;
  title: string;
  slug: string;
  count: number;
};

export function mapCategoryCountToBlogItem(
  row: CategoryCountRow
): BlogCategoryItemDto {
  return {
    id: row.categoryId.toString(),
    title: row.title,
    slug: row.slug,
    count: row.count,
  };
}
