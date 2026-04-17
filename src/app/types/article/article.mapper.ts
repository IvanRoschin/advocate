import type { Types } from 'mongoose';

import {
  firstImage,
  stringArray,
  toIdString,
  toIsoString,
} from '@/app/lib/mappers/_utils';
import type {
  ArticlePublicFullRow,
  ArticlePublicRow,
} from '@/app/lib/repositories/article.repo';
import type {
  ArticleListItemDto,
  ArticlePublicPageDto,
  ArticleResponseDTO,
} from '@/app/types';

/** Admin: model/lean -> ArticleResponseDTO */
type ArticleLike = {
  _id: Types.ObjectId | string;
  slug: string;
  status: ArticleResponseDTO['status'];
  title: string;
  subtitle?: string | null;
  summary: string;
  content: string;
  tags?: unknown;
  src?: unknown;
  language: ArticleResponseDTO['language'];
  authorId: Types.ObjectId | string;
  categoryId: Types.ObjectId | string;
  serviceId: Types.ObjectId | string;
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

export const mapArticleToResponse = (
  article: ArticleLike
): ArticleResponseDTO => ({
  _id: toIdString(article._id),
  slug: article.slug,
  status: article.status,
  title: article.title,
  subtitle: article.subtitle ?? undefined,
  summary: article.summary,
  content: article.content,
  tags: stringArray(article.tags),
  src: stringArray(article.src),
  language: article.language,
  authorId: toIdString(article.authorId),
  categoryId: toIdString(article.categoryId),
  serviceId: toIdString(article.serviceId),
  publishedAt: toIsoString(article.publishedAt),
  createdAt: toIsoString(article.createdAt),
  updatedAt: toIsoString(article.updatedAt),
});

export const mapArticleResponseToPublic = (
  a: ArticleResponseDTO
): ArticlePublicPageDto => ({
  ...a,
  id: a._id,
  author: a.author
    ? { id: a.author._id, name: a.author.name, avatar: a.author.avatar }
    : undefined,
  category: a.category
    ? { id: a.category._id, title: a.category.title, slug: a.category.slug }
    : undefined,
  service: a.service
    ? { id: a.service._id, title: a.service.title, slug: a.service.slug }
    : undefined,
});

/** Public list row -> ArticleListItemDto */
export const mapPublicRowToListItem = (
  a: ArticlePublicRow
): ArticleListItemDto => ({
  id: a._id.toString(),
  slug: a.slug,
  title: a.title,
  summary: a.summary,
  tags: Array.isArray(a.tags) ? a.tags : [],
  src: firstImage(a.src),
  publishedAt: a.publishedAt?.toISOString(),
  updatedAt: a.updatedAt?.toISOString(),
  category: a.categoryId
    ? {
        id: a.categoryId._id.toString(),
        title: a.categoryId.title,
        slug: a.categoryId.slug,
      }
    : undefined,
  service: a.serviceId
    ? {
        id: a.serviceId._id.toString(),
        title: a.serviceId.title,
        slug: a.serviceId.slug,
      }
    : undefined,
});

/** Full public row -> ArticlePublicPageDto */
export const mapPublicFullRowToPage = (
  row: ArticlePublicFullRow
): ArticlePublicPageDto => ({
  id: row._id.toString(),
  slug: row.slug,
  status: row.status,
  title: row.title,
  subtitle: row.subtitle,
  summary: row.summary,
  content: row.content,
  tags: Array.isArray(row.tags) ? row.tags : [],
  src: Array.isArray(row.src) ? row.src : [],
  language: row.language,
  publishedAt: row.publishedAt?.toISOString(),
  category: row.categoryId
    ? {
        id: row.categoryId._id.toString(),
        title: row.categoryId.title,
        slug: row.categoryId.slug,
      }
    : undefined,
  author: row.authorId
    ? {
        id: row.authorId._id.toString(),
        name: row.authorId.name,
        avatar: row.authorId.avatar,
      }
    : undefined,
  service: row.serviceId
    ? {
        id: row.serviceId._id.toString(),
        title: row.serviceId.title,
        slug: row.serviceId.slug,
      }
    : undefined,
});
