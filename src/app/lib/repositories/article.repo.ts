import { Types } from 'mongoose';

import { Article, Category } from '@/app/models';
import type {
  ArticleAdminRow,
  ArticlePublicFullRow,
  ArticlePublicRow,
  CreateArticleRequestDTO,
} from '@/app/types';
import { createQuery } from './queryFactory';
const PUBLIC_SORT = { publishedAt: -1, _id: -1 } as const;

const articleQuery = createQuery(Article);

export const articleRepo = {
  /* ================= CRUD ================= */

  async findAll(): Promise<ArticleAdminRow[]> {
    return Article.find().sort({ createdAt: -1 }).lean<ArticleAdminRow[]>();
  },

  async findAllPaginated(page: number, limit: number) {
    return articleQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount<ArticleAdminRow>();
  },

  async findById(id: string) {
    return Article.findById(id);
  },

  async findBySlug(slug: string) {
    return Article.findOne({ slug })
      .populate('categoryId', 'title slug')
      .populate('authorId', 'name avatar')
      .populate('serviceId', 'title slug')
      .lean<ArticlePublicFullRow>();
  },

  async create(data: CreateArticleRequestDTO) {
    return Article.create(data);
  },

  async update(
    id: string,
    data: Partial<CreateArticleRequestDTO & { slug: string; src: string[] }>
  ): Promise<ArticleAdminRow | null> {
    return Article.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    }).lean<ArticleAdminRow>();
  },

  async deleteById(id: string) {
    return Article.findByIdAndDelete(id);
  },
};

export const articleQueries = {
  async list(args: { page?: number; limit?: number; categorySlug?: string }) {
    const page = Math.max(1, args?.page ?? 1);
    const limit = Math.max(1, args?.limit ?? 10);

    const categoryId = args?.categorySlug
      ? await resolveCategoryIdBySlug(args.categorySlug)
      : null;

    return articleQuery()
      .where({
        status: 'published',
        ...(categoryId ? { categoryId } : {}),
      })
      .sortBy(PUBLIC_SORT)
      .paginate(page, limit)
      .execWithCount<ArticlePublicRow>();
  },

  async recent(limit = 5) {
    return Article.find({ status: 'published' })
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .select('slug title publishedAt')
      .lean();
  },

  async related(args: {
    categoryId: string;
    excludeSlug: string;
    limit?: number;
  }): Promise<ArticlePublicRow[]> {
    return Article.find({
      status: 'published',
      categoryId: new Types.ObjectId(args.categoryId),
      slug: { $ne: args.excludeSlug },
    })
      .sort(PUBLIC_SORT)
      .limit(args.limit ?? 6)
      .lean<ArticlePublicRow[]>();
  },

  async categories() {
    return Article.aggregate([
      { $match: { status: 'published', categoryId: { $ne: null } } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'categories', // перевір реальну назву колекції в MongoDB
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' }, // одночасно відкидає "осиротілі" categoryId, що вказують на видалену категорію
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          title: '$category.title',
          slug: '$category.slug',
          count: 1,
        },
      },
    ]);
  },
};

async function resolveCategoryIdBySlug(slug: string) {
  const category = await Category.findOne({ slug })
    .select('_id')
    .lean<{ _id: Types.ObjectId }>();

  return category?._id ?? null;
}
