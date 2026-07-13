import { Category } from '@/app/models';
import type {
  CategoryAdminRow,
  CategoryPublicRow,
  CreateCategoryRequestDTO,
  UpdateCategoryDTO,
} from '@/app/types';
import { createQuery } from './queryFactory';
const categoryQuery = createQuery(Category);

export const categoryRepo = {
  /* ================= CRUD ================= */

  async findAll(): Promise<CategoryAdminRow[]> {
    return Category.find().sort({ createdAt: -1 }).lean<CategoryAdminRow[]>();
  },

  async findAllPaginated(page: number, limit: number) {
    return categoryQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount<CategoryAdminRow>();
  },

  async findById(id: string) {
    return Category.findById(id);
  },

  async findBySlug(slug: string) {
    return Category.findOne({ slug });
  },

  async create(data: CreateCategoryRequestDTO) {
    return Category.create(data);
  },

  async update(id: string, data: UpdateCategoryDTO) {
    return Category.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return Category.findByIdAndDelete(id);
  },
};

export const categoryQueries = {
  /* ================= PUBLIC LIST ================= */

  async list(limit = 20): Promise<CategoryPublicRow[]> {
    return Category.find()
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .lean<CategoryPublicRow[]>();
  },
};
