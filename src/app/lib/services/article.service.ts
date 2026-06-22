import 'server-only';

import { Types } from 'mongoose';
import slugify from 'slugify';

import { articleRepo } from '@/app/lib/repositories/article.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { Service } from '@/app/models';
import {
  ArticleListItemDto,
  ArticlePreviewDTO,
  ArticlePublicPageDto,
  BlogCategoryItemDto,
  BlogRecentPostItemDto,
  CreateArticleRequestDTO,
  mapArticleToPreviewDTO,
  mapArticleToResponse,
  mapPublicFullRowToPage,
  mapPublicRowToListItem,
  UpdateArticleDTO,
} from '@/app/types';

import { dbConnect } from '../server/mongoose';

/* -------------------------------- Types ----------------------------------- */

export type PublicListResult = {
  items: ArticleListItemDto[];
  total: number;
  hasMore: boolean;
};

/* -------------------------------- Helpers --------------------------------- */

/** Размер страницы для публичного инфинит-скролла */
const PUBLIC_PAGE_SIZE = 9;

const makeSlug = (input: string) =>
  slugify(input, { lower: true, strict: true, locale: 'uk', trim: true });

const assertObjectId = (id: string) => {
  if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
    throw new ValidationError('Невірний id статті');
  }
};

const assertSlug = (slug: string) => {
  const clean = String(slug ?? '')
    .trim()
    .toLowerCase();
  if (!clean || clean === 'undefined') {
    throw new ValidationError('Невірний slug статті');
  }
  return clean;
};

/* ======================================================================== */

export const articleService = {
  /* ------------------------------- Public --------------------------------- */

  async getPublicBySlug(slug: string): Promise<ArticlePublicPageDto> {
    await dbConnect();
    const clean = assertSlug(slug);

    const row = await articleRepo.findPublishedBySlug(clean);
    if (!row) throw new ValidationError('Статтю не знайдено');

    return mapPublicFullRowToPage(row);
  },

  /**
   * SSR: первая страница для blog/page.tsx.
   * Возвращает items + hasMore чтобы page.tsx знал,
   * нужно ли вообще рендерить InfiniteScroll.
   */
  async getPublicList(opts?: {
    page?: number;
    limit?: number;
    categorySlug?: string;
  }): Promise<PublicListResult> {
    await dbConnect();

    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.max(1, opts?.limit ?? PUBLIC_PAGE_SIZE);
    const skip = (page - 1) * limit;

    const { items, total, hasMore } = await articleRepo.findPublicListPaginated(
      limit,
      skip,
      opts?.categorySlug
    );

    return { items: items.map(mapPublicRowToListItem), total, hasMore };
  },

  /**
   * Server Action для клиентской дозагрузки (InfiniteScroll).
   * Возвращает контракт PageResult<ArticleListItemDto>,
   * который ожидает компонент InfiniteScroll: { data, hasMore }.
   */
  async loadMorePublic(opts: {
    page: number;
    limit?: number;
    categorySlug?: string;
  }): Promise<{ data: ArticleListItemDto[]; hasMore: boolean }> {
    await dbConnect();

    const limit = Math.max(1, opts.limit ?? PUBLIC_PAGE_SIZE);
    const skip = (opts.page - 1) * limit;

    const { items, hasMore } = await articleRepo.findPublicListPaginated(
      limit,
      skip,
      opts.categorySlug
    );

    return { data: items.map(mapPublicRowToListItem), hasMore };
  },

  async getRelatedPublicByCategory(args: {
    categoryId: string;
    excludeSlug?: string;
    limit?: number;
  }): Promise<ArticleListItemDto[]> {
    await dbConnect();
    if (!args.categoryId) return [];

    const rows = await articleRepo.findRelatedByCategoryId(args);
    return rows.map(mapPublicRowToListItem);
  },

  async getRelatedArticles(serviceId: string): Promise<ArticlePreviewDTO[]> {
    await dbConnect();
    if (!serviceId) return [];

    const rows = await articleRepo.getRelatedArticles(serviceId);
    return rows.map(mapArticleToPreviewDTO);
  },

  async getRecentPublic(limit = 5): Promise<BlogRecentPostItemDto[]> {
    await dbConnect();

    const rows = await articleRepo.findRecentPublic(limit);
    return rows.map(r => ({
      id: r._id.toString(),
      slug: r.slug,
      title: r.title,
      publishedAt: r.publishedAt?.toISOString(),
    }));
  },

  async getPublicCategoriesWithCounts(): Promise<BlogCategoryItemDto[]> {
    await dbConnect();

    const rows = await articleRepo.findPublicCategoriesWithCounts();
    return rows.map(r => ({
      id: r.categoryId.toString(),
      title: r.title,
      slug: r.slug,
      count: r.count,
    }));
  },

  /* -------------------------------- Admin --------------------------------- */

  async getAllPaginated(opts?: { page?: number; limit?: number }) {
    await dbConnect();

    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.max(1, opts?.limit ?? 20);
    const skip = (page - 1) * limit;

    const result = await articleRepo.findAllPaginated(limit, skip);

    return {
      items: result.items.map(mapArticleToResponse),
      total: result.total,
      hasMore: result.hasMore,
    };
  },

  async getById(id: string) {
    await dbConnect();
    assertObjectId(id);

    const article = await articleRepo.findById(id);
    if (!article) throw new ValidationError('Статтю не знайдено');
    return article;
  },

  async create(data: CreateArticleRequestDTO) {
    await dbConnect();

    const base = data.slug?.trim() ? data.slug : data.title;
    const slug = makeSlug(base);

    const existing = await articleRepo.findBySlug(slug);
    if (existing) throw new ValidationError('Стаття з таким slug вже існує');

    const src = Array.isArray(data.src) ? data.src : [];
    return articleRepo.create({ ...data, slug, src });
  },

  async update(id: string, data: UpdateArticleDTO) {
    await dbConnect();
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

  async delete(id: string) {
    await dbConnect();
    assertObjectId(id);

    const article = await articleRepo.findById(id);
    if (!article) throw new ValidationError('Статтю не знайдено');

    await Service.deleteMany({ relatedArticles: article._id });
    await articleRepo.deleteById(id);

    return { ok: true };
  },
};
