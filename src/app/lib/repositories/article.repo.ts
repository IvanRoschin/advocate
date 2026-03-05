import { PopulateOptions, Types } from 'mongoose';

import { Article } from '@/app/models';
import type {
  ArticleLanguage,
  ArticleStatus,
  CreateArticleRequestDTO,
} from '@/app/types';

/* ----------------------------- Lean row types ----------------------------- */
export type CategoryLean = { _id: Types.ObjectId; title: string; slug: string };
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

const POPULATE_PUBLIC: PopulateOptions[] = [
  {
    path: 'categoryId',
    select: '_id title slug',
  },
  {
    path: 'authorId',
    select: '_id name avatar',
  },
];

export const articleRepo = {
  /* ----------------------------- Admin queries ---------------------------- */

  findAll() {
    return Article.find().sort({ createdAt: -1 }).lean();
  },

  findAllWithPopulate() {
    return Article.find()
      .populate('authorId')
      .populate('categoryId')
      .sort({ createdAt: -1 })
      .lean();
  },

  findById(id: string) {
    return Article.findById(id);
  },

  findByIdWithPopulate(id: string) {
    return Article.findById(id).populate('authorId').populate('categoryId');
  },

  findBySlug(slug: string) {
    return Article.findOne({ slug }); // для админ-проверок уникальности
  },

  /* ------------------------------ Public list ----------------------------- */

  findPublicList(limit = 24): Promise<ArticlePublicRow[]> {
    return Article.find({ status: 'published' })
      .select('_id slug title summary tags src publishedAt categoryId')
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .populate({ path: 'categoryId', select: 'title slug' })
      .lean<ArticlePublicRow[]>();
  },

  /* ------------------------------ Public page ----------------------------- */

  findPublishedBySlug(slug: string): Promise<ArticlePublicFullRow | null> {
    return Article.findOne({ slug, status: 'published' })
      .select(
        'slug status title subtitle summary content tags src language publishedAt categoryId authorId'
      )
      .populate(POPULATE_PUBLIC)
      .lean<ArticlePublicFullRow>();
  },

  async findPublicListByCategorySlug(categorySlug: string, limit = 30) {
    return Article.find({ status: 'published' })
      .select('_id slug title summary tags src publishedAt categoryId')
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .populate({
        path: 'categoryId',
        select: 'title slug',
        match: { slug: categorySlug },
      })
      .lean()
      .then(rows => rows.filter(r => r.categoryId)); // потому что match может занулить populate
  },
  /* ---------------------------- Public utilities -------------------------- */

  findRecentPublic(limit = 5): Promise<ArticleRecentRow[]> {
    return Article.find({ status: 'published' })
      .sort({ publishedAt: -1, _id: -1 })
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
          from: 'categories', // ⚠️ проверь имя коллекции
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

  findRelatedByCategoryId(args: {
    categoryId: string;
    excludeSlug?: string;
    limit?: number;
  }): Promise<ArticlePublicRow[]> {
    const limit = args.limit ?? 6;

    return Article.find({
      status: 'published',
      categoryId: new Types.ObjectId(args.categoryId),
      ...(args.excludeSlug ? { slug: { $ne: args.excludeSlug } } : {}),
    })
      .select('_id slug title summary tags src publishedAt categoryId')
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .populate({ path: 'categoryId', select: 'title slug' })
      .lean<ArticlePublicRow[]>();
  },

  /* ----------------------------- Mutations -------------------------------- */

  create(data: CreateArticleRequestDTO & { slug: string; src: string[] }) {
    return Article.create(data);
  },

  deleteById(id: string) {
    return Article.findByIdAndDelete(id);
  },
};
