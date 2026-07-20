import type { Types } from 'mongoose';

import type {
  ArticleLanguage,
  ArticleResponseDTO,
  ArticleStatus,
} from '@/app/types';

type CategoryLean = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
};

type ServiceLean = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
};

type AuthorLean = {
  _id: Types.ObjectId;
  name: string;
  avatar?: string;
};

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
  serviceId?: ServiceLean | null;
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
  serviceId?: ServiceLean | null;
};

export type ArticleRecentRow = {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  publishedAt?: Date;
};

export type ArticleAdminRow = {
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

  authorId?: Types.ObjectId | null;
  categoryId?: Types.ObjectId | null;
  serviceId?: Types.ObjectId | null;

  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ArticleLike = {
  _id: Types.ObjectId | string;

  slug: string;
  status: ArticleResponseDTO['status'];

  title: string;
  subtitle?: string | null;

  summary: string;
  content: string;

  tags?: string[] | string;
  src?: string[];

  language: ArticleResponseDTO['language'];

  authorId?: Types.ObjectId | string | null;
  categoryId?: Types.ObjectId | string | null;
  serviceId?: Types.ObjectId | string | null;

  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};
