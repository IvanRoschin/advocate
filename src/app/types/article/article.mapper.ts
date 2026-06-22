import type {
  ArticleLike,
  ArticlePublicFullRow,
  ArticlePublicRow,
} from '@/types';
import type {
  ArticleListItemDto,
  ArticlePreviewDTO,
  ArticlePublicPageDto,
  ArticleResponseDTO,
} from '@/app/types';
import {
  firstImage,
  stringArray,
  toIdString,
  toIsoString,
} from '@/app/lib/mappers/_utils';

/* ======================================================================== */
/* ADMIN                                                                    */
/* ======================================================================== */

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

  authorId: article.authorId ? toIdString(article.authorId) : '',
  categoryId: article.categoryId ? toIdString(article.categoryId) : '',
  serviceId: article.serviceId ? toIdString(article.serviceId) : '',

  publishedAt: toIsoString(article.publishedAt),
  createdAt: toIsoString(article.createdAt),
  updatedAt: toIsoString(article.updatedAt),
});

/* ======================================================================== */
/* RESPONSE DTO -> PUBLIC DTO                                               */
/* ======================================================================== */

export const mapArticleResponseToPublic = (
  article: ArticleResponseDTO
): ArticlePublicPageDto => ({
  ...article,
  id: article._id,

  author: article.author
    ? {
        id: article.author._id,
        name: article.author.name,
        avatar: article.author.avatar,
      }
    : undefined,

  category: article.category
    ? {
        id: article.category._id,
        title: article.category.title,
        slug: article.category.slug,
      }
    : undefined,

  service: article.service
    ? {
        id: article.service._id,
        title: article.service.title,
        slug: article.service.slug,
      }
    : undefined,
});

/* ======================================================================== */
/* PUBLIC LIST                                                              */
/* ======================================================================== */

export const mapPublicRowToListItem = (
  article: ArticlePublicRow
): ArticleListItemDto => ({
  id: toIdString(article._id),
  slug: article.slug,
  title: article.title,
  summary: article.summary,

  tags: stringArray(article.tags),
  src: firstImage(article.src),

  publishedAt: toIsoString(article.publishedAt),
  updatedAt: toIsoString(article.updatedAt),

  category: article.categoryId
    ? {
        id: toIdString(article.categoryId._id),
        title: article.categoryId.title,
        slug: article.categoryId.slug,
      }
    : undefined,

  service: article.serviceId
    ? {
        id: toIdString(article.serviceId._id),
        title: article.serviceId.title,
        slug: article.serviceId.slug,
      }
    : undefined,
});

/* ======================================================================== */
/* PUBLIC PAGE                                                              */
/* ======================================================================== */

export const mapPublicFullRowToPage = (
  article: ArticlePublicFullRow
): ArticlePublicPageDto => ({
  id: toIdString(article._id),

  slug: article.slug,
  status: article.status,

  title: article.title,
  subtitle: article.subtitle,

  summary: article.summary,
  content: article.content,

  tags: stringArray(article.tags),
  src: stringArray(article.src),

  language: article.language,
  publishedAt: toIsoString(article.publishedAt),

  category: article.categoryId
    ? {
        id: toIdString(article.categoryId._id),
        title: article.categoryId.title,
        slug: article.categoryId.slug,
      }
    : undefined,

  author: article.authorId
    ? {
        id: toIdString(article.authorId._id),
        name: article.authorId.name,
        avatar: article.authorId.avatar,
      }
    : undefined,

  service: article.serviceId
    ? {
        id: toIdString(article.serviceId._id),
        title: article.serviceId.title,
        slug: article.serviceId.slug,
      }
    : undefined,
});

/* ======================================================================== */
/* PREVIEW                                                                  */
/* ======================================================================== */

export const mapArticleToPreviewDTO = (
  article: ArticleLike
): ArticlePreviewDTO => ({
  id: toIdString(article._id),
  title: article.title,
  slug: article.slug,
  summary: article.summary,
  src: stringArray(article.src),
  publishedAt: toIsoString(article.publishedAt),
});
