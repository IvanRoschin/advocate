import {
  firstImage,
  stringArray,
  toIdString,
  toIsoString,
} from '@/app/lib/mappers/_utils';
import type {
  ArticleListItemDto,
  ArticlePublicPageDto,
  ArticleRecentRow,
  ArticleResponseDTO,
  BlogRecentPostItemDto,
} from '@/app/types';
import type {
  ArticleLike,
  ArticlePublicFullRow,
  ArticlePublicRow,
} from '@/types';

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

export function mapRecentRowToBlogItem(
  row: ArticleRecentRow
): BlogRecentPostItemDto {
  return {
    id: row._id.toString(),
    slug: row.slug,
    title: row.title,
    publishedAt: row.publishedAt ?? undefined,
  };
}
