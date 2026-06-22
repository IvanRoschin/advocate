'use server';

import { Types } from 'mongoose';
import slugify from 'slugify';

import { articleRepo } from '@/app/lib/repositories/article.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { Service } from '@/app/models';
import {
  ArticleLike,
  ArticleListItemDto,
  ArticlePreviewDTO,
  BlogCategoryItemDto,
  BlogRecentPostItemDto,
  CreateArticleRequestDTO,
  mapArticleToPreviewDTO,
  mapArticleToResponse,
  mapPublicRowToListItem,
  UpdateArticleDTO,
} from '@/app/types';

import { getPagination } from '../helpers';
import { createAction } from './actionFactory';

/* ======================================================================== */
/* HELPERS                                                                  */
/* ======================================================================== */

const PUBLIC_PAGE_SIZE = 9;

const makeSlug = (input: string) =>
  slugify(input, { lower: true, strict: true, locale: 'uk', trim: true });

const assertObjectId = (id: string) => {
  if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
    throw new ValidationError('Невірний id статті');
  }
};

/* ======================================================================== */
/* PUBLIC ACTIONS                                                          */
/* ======================================================================== */

type GetArticlesPublicListArgs = {
  page?: number;
  limit?: number;
  categorySlug?: string;
};

type ArticleDocument = NonNullable<
  Awaited<ReturnType<typeof articleRepo.findById>>
>;

export const getArticlesPublicList = createAction<
  GetArticlesPublicListArgs,
  {
    items: ReturnType<typeof mapPublicRowToListItem>[];
    total: number;
    hasMore: boolean;
  }
>({
  handler: async ({ args }) => {
    const { page = 1, limit = 9, categorySlug } = args ?? {};

    const skip = (page - 1) * limit;

    const result = await articleRepo.findPublicListPaginated(
      limit,
      skip,
      categorySlug
    );

    return {
      items: result.items.map(mapPublicRowToListItem),
      total: result.total,
      hasMore: result.hasMore,
    };
  },
});

export const loadMoreArticlesPublic = createAction<
  {
    page: number;
    limit?: number;
    categorySlug?: string;
  },
  {
    data: ArticleListItemDto[];
    hasMore: boolean;
  }
>({
  handler: async ({ args }) => {
    const limit = Math.max(1, args.limit ?? PUBLIC_PAGE_SIZE);
    const skip = (args.page - 1) * limit;

    const { items, hasMore } = await articleRepo.findPublicListPaginated(
      limit,
      skip,
      args.categorySlug
    );

    return {
      data: items.map(mapPublicRowToListItem),
      hasMore,
    };
  },
});

export const getRecentArticlesPublic = createAction<
  { limit?: number },
  BlogRecentPostItemDto[]
>({
  handler: async ({ args }) => {
    const rows = await articleRepo.findRecentPublic(args?.limit ?? 5);

    return rows.map(r => ({
      id: r._id.toString(),
      slug: r.slug,
      title: r.title,
      publishedAt: r.publishedAt?.toISOString(),
    }));
  },
});

export const getArticleCategoriesWithCounts = createAction<
  void,
  BlogCategoryItemDto[]
>({
  handler: async () => {
    const rows = await articleRepo.findPublicCategoriesWithCounts();

    return rows.map(r => ({
      id: r.categoryId.toString(),
      title: r.title,
      slug: r.slug,
      count: r.count,
    }));
  },
});

export const getRelatedArticlesByCategory = createAction<
  {
    categoryId: string;
    excludeSlug?: string;
    limit?: number;
  },
  ArticleListItemDto[]
>({
  handler: async ({ args }) => {
    if (!args.categoryId) return [];

    const rows = await articleRepo.findRelatedByCategoryId(args);

    return rows.map(mapPublicRowToListItem);
  },
});

export const getRelatedArticles = createAction<string, ArticlePreviewDTO[]>({
  handler: async ({ args }) => {
    if (!args) return [];

    const rows = await articleRepo.getRelatedArticles(args);

    return rows.map(mapArticleToPreviewDTO);
  },
});

/* ======================================================================== */
/* ADMIN ACTIONS                                                           */
/* ======================================================================== */

export const getArticlesAdminPaginated = createAction<
  { page?: number; limit?: number },
  {
    items: ReturnType<typeof mapArticleToResponse>[];
    total: number;
    hasMore: boolean;
  }
>({
  handler: async ({ args }) => {
    const p = getPagination(args?.page, args?.limit ?? 20);

    const result = await articleRepo.findAllPaginated(p.limit, p.skip);

    return {
      items: result.items.map(mapArticleToResponse),
      total: result.total,
      hasMore: result.hasMore,
    };
  },
});

export const getArticleById = createAction<string, ArticleLike>({
  handler: async ({ args }) => {
    assertObjectId(args);

    const article = await articleRepo.findById(args);
    if (!article) throw new ValidationError('Статтю не знайдено');

    return article;
  },
});

export const createArticle = createAction<
  CreateArticleRequestDTO,
  ArticleDocument
>({
  handler: async ({ args }) => {
    const base = args.slug?.trim() ? args.slug : args.title;
    const slug = makeSlug(base);

    const existing = await articleRepo.findBySlug(slug);
    if (existing) throw new ValidationError('Стаття з таким slug вже існує');

    const src = Array.isArray(args.src) ? args.src : [];

    return articleRepo.create({
      ...args,
      slug,
      src,
    });
  },
});

export const updateArticle = createAction<
  { id: string; data: UpdateArticleDTO },
  ArticleDocument
>({
  handler: async ({ args }) => {
    const { id, data } = args;

    assertObjectId(id);

    const article = await articleRepo.findById(id);
    if (!article) throw new ValidationError('Статтю не знайдено');

    const nextTitle =
      typeof data.title === 'string' ? data.title : String(article.title);

    const nextSlugBase =
      typeof data.slug === 'string' && data.slug.trim() ? data.slug : nextTitle;

    const nextSlug = makeSlug(nextSlugBase);

    const conflict = await articleRepo.findBySlug(nextSlug);

    if (conflict && conflict._id.toString() !== article._id.toString()) {
      throw new ValidationError('Стаття з таким slug вже існує');
    }

    const nextSrc =
      data.src === null ? [] : Array.isArray(data.src) ? data.src : undefined;

    Object.assign(article, {
      ...data,
      ...(nextSrc !== undefined ? { src: nextSrc } : {}),
      slug: nextSlug,
    });

    if (data.status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    if (data.status === 'draft') {
      article.publishedAt = undefined;
    }

    await article.save();
    return article;
  },
});

export const deleteArticle = createAction<string, { ok: true }>({
  handler: async ({ args }) => {
    assertObjectId(args);

    const article = await articleRepo.findById(args);
    if (!article) throw new ValidationError('Статтю не знайдено');

    await Service.deleteMany({ relatedArticles: article._id });
    await articleRepo.deleteById(args);

    return { ok: true };
  },
});
