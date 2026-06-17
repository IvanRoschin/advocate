import { PopulateOptions, Types } from 'mongoose';

import { Article } from '@/app/models';
import type {
  ArticleLanguage,
  ArticleLike,
  ArticleStatus,
  CreateArticleRequestDTO,
} from '@/app/types';

/* ----------------------------- Lean row types ----------------------------- */

export type CategoryLean = { _id: Types.ObjectId; title: string; slug: string };
export type ServiceLean = { _id: Types.ObjectId; title: string; slug: string };
export type AuthorLean = { _id: Types.ObjectId; name: string; avatar?: string };

export type ArticlePublicFullRow = {
  _id: Types.ObjectId;
  slug: string;
  status: ArticleStatus;
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
  tags?: string[];
  src?: string[];
  language: ArticleLanguage;
  publishedAt?: Date;
  categoryId?: CategoryLean | null;
  serviceId?: ServiceLean | null;
  authorId?: AuthorLean | null;
};

export type ArticlePublicRow = {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  summary: string;
  tags?: string[];
  src?: string[];
  publishedAt?: Date;
  updatedAt?: Date;
  categoryId?: CategoryLean | null;
  serviceId?: ServiceLean | null;
};

export type ArticleRecentRow = {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  publishedAt?: Date;
};

export type CategoryCountRow = {
  categoryId: Types.ObjectId;
  title: string;
  slug: string;
  count: number;
};

export type RepoPaginatedResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
};

/* -------------------------------- Shared ---------------------------------- */

const POPULATE_PUBLIC: PopulateOptions[] = [
  { path: 'serviceId', select: '_id title slug' },
  { path: 'categoryId', select: '_id title slug' },
  { path: 'authorId', select: '_id name avatar' },
];

const PUBLIC_LIST_SELECT =
  '_id slug title summary tags src publishedAt updatedAt categoryId serviceId';

const PUBLIC_LIST_SORT = { publishedAt: -1, _id: -1 } as const;

/* ======================================================================== */

export const articleRepo = {
  /* ----------------------------- Public list ------------------------------ */

  async findPublicListPaginated(
    limit: number,
    skip: number,
    categorySlug?: string
  ): Promise<RepoPaginatedResult<ArticlePublicRow>> {
    const baseMatch: Record<string, unknown> = { status: 'published' };

    if (categorySlug) {
      const [rows, total] = await Promise.all([
        Article.find(baseMatch)
          .select(PUBLIC_LIST_SELECT)
          .sort(PUBLIC_LIST_SORT)
          .populate<{ categoryId: CategoryLean | null }>({
            path: 'categoryId',
            select: '_id title slug',
            match: { slug: categorySlug },
          })
          .lean<ArticlePublicRow[]>()
          .then(all => all.filter(r => r.categoryId !== null)),
        articleRepo.countPublishedByCategory(categorySlug),
      ]);

      const page = rows.slice(skip, skip + limit);
      return { items: page, total, hasMore: skip + page.length < total };
    }

    const [items, total] = await Promise.all([
      Article.find(baseMatch)
        .select(PUBLIC_LIST_SELECT)
        .sort(PUBLIC_LIST_SORT)
        .skip(skip)
        .limit(limit)
        .populate({ path: 'categoryId', select: '_id title slug' })
        .lean<ArticlePublicRow[]>(),
      Article.countDocuments(baseMatch),
    ]);

    return { items, total, hasMore: skip + items.length < total };
  },

  /* ----------------------------- Public page ------------------------------ */

  findPublishedBySlug(slug: string): Promise<ArticlePublicFullRow | null> {
    return Article.findOne({ slug, status: 'published' })
      .populate(POPULATE_PUBLIC)
      .lean<ArticlePublicFullRow>();
  },

  /* ---------------------------- Public utilities -------------------------- */

  findRecentPublic(limit = 5): Promise<ArticleRecentRow[]> {
    return Article.find({ status: 'published' })
      .sort(PUBLIC_LIST_SORT)
      .limit(limit)
      .select('slug title publishedAt')
      .lean<ArticleRecentRow[]>();
  },

  findPublicCategoriesWithCounts(): Promise<CategoryCountRow[]> {
    return Article.aggregate<CategoryCountRow>([
      { $match: { status: 'published', categoryId: { $type: 'objectId' } } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          categoryId: '$category._id',
          title: '$category.title',
          slug: '$category.slug',
          count: 1,
        },
      },
      { $sort: { count: -1, title: 1 } },
    ]);
  },

  async countPublishedByCategory(categorySlug: string): Promise<number> {
    const result = await Article.aggregate<{ count: number }>([
      { $match: { status: 'published', categoryId: { $type: 'objectId' } } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'cat',
        },
      },
      { $unwind: '$cat' },
      { $match: { 'cat.slug': categorySlug } },
      { $count: 'count' },
    ]);
    return result[0]?.count ?? 0;
  },

  findRelatedByCategoryId(args: {
    categoryId: string;
    excludeSlug?: string;
    limit?: number;
  }): Promise<ArticlePublicRow[]> {
    return Article.find({
      status: 'published',
      categoryId: new Types.ObjectId(args.categoryId),
      ...(args.excludeSlug ? { slug: { $ne: args.excludeSlug } } : {}),
    })
      .select(PUBLIC_LIST_SELECT)
      .sort(PUBLIC_LIST_SORT)
      .limit(args.limit ?? 6)
      .populate({ path: 'categoryId', select: '_id title slug' })
      .lean<ArticlePublicRow[]>();
  },

  getRelatedArticles(serviceId: string) {
    return Article.find({ serviceId, status: 'published' })
      .sort(PUBLIC_LIST_SORT)
      .limit(6)
      .lean();
  },

  /* ----------------------------- Admin queries ---------------------------- */

  findById(id: string) {
    return Article.findById(id);
  },

  findBySlug(slug: string) {
    return Article.findOne({ slug });
  },

  async findAllPaginated(
    limit: number,
    skip: number
  ): Promise<RepoPaginatedResult<ArticleLike>> {
    const [items, total] = await Promise.all([
      Article.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Article.countDocuments(),
    ]);
    return { items, total, hasMore: skip + items.length < total };
  },

  /* ----------------------------- Mutations -------------------------------- */

  create(data: CreateArticleRequestDTO & { slug: string; src: string[] }) {
    return Article.create(data);
  },

  deleteById(id: string) {
    return Article.findByIdAndDelete(id);
  },
};
