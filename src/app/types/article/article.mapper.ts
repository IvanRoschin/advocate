import type { ArticleDocument } from '@/app/models/Article';
import type { ArticleListItemDto, ArticlePublicDto } from './article.dto';

type PopulatedAuthor = {
  _id: unknown;
  name: string;
  avatar?: string;
};

type PopulatedCategory = {
  _id: unknown;
  title: string;
  slug: string;
};

type ArticleWithPopulate = ArticleDocument & {
  authorId: ArticleDocument['authorId'] | PopulatedAuthor;
  categoryId: ArticleDocument['categoryId'] | PopulatedCategory;
};

const toIso = (d?: Date | null) => (d ? d.toISOString() : undefined);

function isPopulatedAuthor(value: unknown): value is PopulatedAuthor {
  return typeof value === 'object' && value !== null && 'name' in value;
}

function isPopulatedCategory(value: unknown): value is PopulatedCategory {
  return typeof value === 'object' && value !== null && 'title' in value;
}

export function mapArticleToPublicDto(
  doc: ArticleWithPopulate
): ArticlePublicDto {
  return {
    id: String(doc._id),
    slug: doc.slug,

    status: doc.status,

    title: doc.title,
    subtitle: doc.subtitle ?? undefined,

    summary: doc.summary,
    content: doc.content,

    tags: Array.isArray(doc.tags) ? doc.tags : [],

    coverImage: doc.coverImage
      ? {
          url: doc.coverImage.url,
          publicId: doc.coverImage.publicId,
          alt: doc.coverImage.alt ?? undefined,
          width: doc.coverImage.width ?? undefined,
          height: doc.coverImage.height ?? undefined,
        }
      : undefined,

    language: doc.language,

    authorId: String(
      isPopulatedAuthor(doc.authorId) ? doc.authorId._id : doc.authorId
    ),

    categoryId: String(
      isPopulatedCategory(doc.categoryId) ? doc.categoryId._id : doc.categoryId
    ),

    author: isPopulatedAuthor(doc.authorId)
      ? {
          id: String(doc.authorId._id),
          name: doc.authorId.name,
          avatar: doc.authorId.avatar ?? undefined,
        }
      : undefined,

    category: isPopulatedCategory(doc.categoryId)
      ? {
          id: String(doc.categoryId._id),
          title: doc.categoryId.title,
          slug: doc.categoryId.slug,
        }
      : undefined,

    publishedAt: toIso(doc.publishedAt),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function mapArticleToListItem(
  doc: ArticleWithPopulate
): ArticleListItemDto {
  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    coverUrl: doc.coverImage?.url,
    publishedAt: toIso(doc.publishedAt),
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    category: isPopulatedCategory(doc.categoryId)
      ? {
          id: String(doc.categoryId._id),
          title: doc.categoryId.title,
          slug: doc.categoryId.slug,
        }
      : undefined,
  };
}
