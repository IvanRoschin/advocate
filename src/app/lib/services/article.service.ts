import { Types } from 'mongoose';
import slugify from 'slugify';

import { articleRepo } from '@/app/lib/repositories/article.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import {
  ArticleListItemDto,
  ArticlePublicPageDto,
  BlogCategoryItemDto,
  BlogRecentPostItemDto,
  CreateArticleRequestDTO,
  mapPublicFullRowToPage,
  mapPublicRowToListItem,
  UpdateArticleDTO,
} from '@/app/types';
import { dbConnect } from '../server/mongoose';

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
  if (!clean || clean === 'undefined')
    throw new ValidationError('Невірний slug статті');
  return clean;
};

export const articleService = {
  /* ------------------------------- Public -------------------------------- */

  async getPublicBySlug(slug: string): Promise<ArticlePublicPageDto> {
    await dbConnect();
    const clean = assertSlug(slug);

    const row = await articleRepo.findPublishedBySlug(clean);
    if (!row) throw new ValidationError('Статтю не знайдено');

    return mapPublicFullRowToPage(row);
  },

  async getPublicList(opts?: {
    categorySlug?: string;
    limit?: number;
  }): Promise<ArticleListItemDto[]> {
    await dbConnect();
    const limit = opts?.limit ?? 30;

    const rows = opts?.categorySlug
      ? await articleRepo.findPublicListByCategorySlug(opts.categorySlug, limit)
      : await articleRepo.findPublicList(limit);

    return rows.map(mapPublicRowToListItem);
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

  /* -------------------------------- Admin -------------------------------- */

  async getAll() {
    await dbConnect();
    return articleRepo.findAll();
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

    const exists = await articleRepo.findBySlug(nextSlug);
    if (exists && exists._id.toString() !== article._id.toString()) {
      throw new ValidationError('Стаття з таким slug вже існує');
    }

    const nextSrc =
      data.src === null ? [] : Array.isArray(data.src) ? data.src : undefined;

    Object.assign(article, {
      ...data,
      ...(nextSrc !== undefined ? { src: nextSrc } : {}),
      slug: nextSlug,
    });

    if (data.status === 'published' && !article.publishedAt)
      article.publishedAt = new Date();
    if (data.status === 'draft') article.publishedAt = undefined;

    await article.save();
    return article;
  },

  async delete(id: string) {
    await dbConnect();
    assertObjectId(id);

    const deleted = await articleRepo.deleteById(id);
    if (!deleted) throw new ValidationError('Статтю не знайдено');

    return { ok: true };
  },
};
