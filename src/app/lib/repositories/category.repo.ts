import {
  CategoryResponseDTO,
  CreateCategoryRequestDTO,
  UpdateCategoryDTO,
} from '@/app/types';
import { Category } from '@/models';

export const categoryRepo = {
  async findAll() {
    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    if (!categories || categories.length === 0) {
      return [];
    }

    return categories;
  },

  findById(id: string) {
    return Category.findById(id);
  },

  findBySlug(slug: string) {
    return Category.findOne({ slug });
  },

  create(data: CreateCategoryRequestDTO) {
    return Category.create(data);
  },

  update(id: string, data: UpdateCategoryDTO) {
    return Category.findByIdAndUpdate(id, data, { new: true });
  },

  delete(id: string) {
    return Category.findByIdAndDelete(id);
  },
  findPublicList(limit = 20): Promise<CategoryResponseDTO[]> {
    return Category.find()
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .lean<CategoryResponseDTO[]>();
  },
};
