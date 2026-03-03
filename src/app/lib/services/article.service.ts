import { Types } from 'mongoose';
import slugify from 'slugify';

import { articleRepo } from '@/app/lib/repositories/article.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import type {
  ArticleListItemDto,
  CreateArticleRequestDTO,
  UpdateArticleDTO,
} from '@/app/types';
import { dbConnect } from '../server/mongoose';

type CategoryLean = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
};

type ArticlePublicRow = {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  summary: string;
  tags?: string[];
  src?: string[];
  publishedAt?: Date;
  categoryId?: CategoryLean | null;
};

const makeSlug = (input: string) =>
  slugify(input, {
    lower: true,
    strict: true,
    locale: 'uk',
    trim: true,
  });

const assertObjectId = (id: string) => {
  if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
    throw new ValidationError('Невірний id статті');
  }
};

export const articleService = {
  async getPublicList(): Promise<ArticleListItemDto[]> {
    await dbConnect();

    const rows = (await articleRepo.findPublicList(30)) as ArticlePublicRow[];

    return rows.map(
      (a): ArticleListItemDto => ({
        id: a._id.toString(),
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        tags: Array.isArray(a.tags) ? a.tags : [],
        src: Array.isArray(a.src) && a.src.length ? a.src[0] : undefined,
        publishedAt: a.publishedAt?.toISOString(),
        category: a.categoryId
          ? {
              id: a.categoryId._id.toString(),
              title: a.categoryId.title,
              slug: a.categoryId.slug,
            }
          : undefined,
      })
    );
  },

  async getAll() {
    await dbConnect();
    return articleRepo.findAll();
  },

  async getAllWithPopulate() {
    await dbConnect();
    return articleRepo.findAllWithPopulate();
  },

  async getById(id: string) {
    await dbConnect();
    assertObjectId(id);

    const article = await articleRepo.findById(id);

    if (!article) {
      throw new ValidationError('Статтю не знайдено');
    }

    return article;
  },

  async getByIdWithPopulate(id: string) {
    await dbConnect();
    assertObjectId(id);

    const article = await articleRepo.findByIdWithPopulate(id);

    if (!article) {
      throw new ValidationError('Статтю не знайдено');
    }

    return article;
  },

  async create(data: CreateArticleRequestDTO) {
    await dbConnect();

    const base = data.slug?.trim() ? data.slug : data.title;
    const slug = makeSlug(base);

    const existing = await articleRepo.findBySlug(slug);

    if (existing) {
      throw new ValidationError('Стаття з таким slug вже існує');
    }

    const src = Array.isArray(data.src) ? data.src : [];

    const article = await articleRepo.create({
      ...data,
      slug,
      src,
    });

    return article;
  },

  async update(id: string, data: UpdateArticleDTO) {
    await dbConnect();
    assertObjectId(id);

    const article = await articleRepo.findById(id);

    if (!article) {
      throw new ValidationError('Статтю не знайдено');
    }

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

    const deleted = await articleRepo.delete(id);

    if (!deleted) {
      throw new ValidationError('Статтю не знайдено');
    }

    return deleted;
  },
};
