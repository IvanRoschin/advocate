import { PopulateOptions, Types } from 'mongoose';

import { Article } from '@/app/models';

import type {
  ArticleAdminRow,
  ArticlePublicFullRow,
  ArticlePublicRow,
  ArticleRecentRow,
  CreateArticleRequestDTO,
} from '@/app/types';

/* ----------------------------- Lean types ----------------------------- */

export type CategoryLean = { _id: Types.ObjectId; title: string; slug: string };
export type ServiceLean = { _id: Types.ObjectId; title: string; slug: string };
export type AuthorLean = { _id: Types.ObjectId; name: string; avatar?: string };

export type RepoPaginatedResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
};

/* ----------------------------- shared ----------------------------- */

const POPULATE_PUBLIC: PopulateOptions[] = [
  { path: 'serviceId', select: '_id title slug' },
  { path: 'categoryId', select: '_id title slug' },
  { path: 'authorId', select: '_id name avatar' },
];

const PUBLIC_LIST_SELECT =
  '_id slug title summary tags src publishedAt updatedAt categoryId serviceId';

const PUBLIC_LIST_SORT = { publishedAt: -1, _id: -1 } as const;

/* ======================================================================== */
/* REPO                                                                     */
/* ======================================================================== */

export const articleRepo = {
  /* ---------------- Public ---------------- */

  async findPublicListPaginated(
    limit: number,
    skip: number,
    categorySlug?: string
  ) {
    const baseMatch: Record<string, unknown> = { status: 'published' };

    if (categorySlug) {
      return (async () => {
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

          this.countPublishedByCategory(categorySlug),
        ]);

        const page = rows.slice(skip, skip + limit);

        return {
          items: page,
          total,
          hasMore: skip + page.length < total,
        };
      })();
    }

    return Promise.all([
      Article.find(baseMatch)
        .select(PUBLIC_LIST_SELECT)
        .sort(PUBLIC_LIST_SORT)
        .skip(skip)
        .limit(limit)
        .populate({ path: 'categoryId', select: '_id title slug' })
        .lean<ArticlePublicRow[]>(),

      Article.countDocuments(baseMatch),
    ]).then(([items, total]) => ({
      items,
      total,
      hasMore: skip + items.length < total,
    }));
  },

  async findPublishedBySlug(
    slug: string
  ): Promise<ArticlePublicFullRow | null> {
    return Article.findOne({
      slug,
      status: 'published',
    })
      .populate(POPULATE_PUBLIC)
      .lean<ArticlePublicFullRow>();
  },

  async findRecentPublic(limit = 5): Promise<ArticleRecentRow[]> {
    return Article.find({
      status: 'published',
    })
      .sort(PUBLIC_LIST_SORT)
      .limit(limit)
      .select('slug title publishedAt')
      .lean<ArticleRecentRow[]>();
  },

  async findPublicCategoriesWithCounts() {
    return Article.aggregate([
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

  async countPublishedByCategory(categorySlug: string) {
    return Article.aggregate([
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
    ]).then(r => r[0]?.count ?? 0);
  },

  async findRelatedByCategoryId(args: {
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
      .populate({
        path: 'categoryId',
        select: '_id title slug',
      })
      .lean<ArticlePublicRow[]>();
  },

  async getRelatedArticles(serviceId: string): Promise<ArticleAdminRow[]> {
    return Article.find({
      serviceId,
      status: 'published',
    })
      .sort(PUBLIC_LIST_SORT)
      .limit(6)
      .lean<ArticleAdminRow[]>();
  },

  /* ---------------- Admin ---------------- */

  async findById(id: string) {
    return Article.findById(id);
  },

  async findBySlug(slug: string) {
    return Article.findOne({ slug });
  },

  async findAllPaginated(
    limit: number,
    skip: number
  ): Promise<RepoPaginatedResult<ArticleAdminRow>> {
    const [items, total] = await Promise.all([
      Article.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<ArticleAdminRow[]>(),

      Article.countDocuments(),
    ]);

    return {
      items,
      total,
      hasMore: skip + items.length < total,
    };
  },

  async create(
    data: CreateArticleRequestDTO & {
      slug: string;
      src: string[];
    }
  ) {
    return Article.create(data);
  },

  async deleteById(id: string) {
    return Article.findByIdAndDelete(id);
  },
};
