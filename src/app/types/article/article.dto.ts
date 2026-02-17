export type ArticleStatus = 'draft' | 'published';

export type CoverImageDto = {
  url: string;
  publicId: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type ArticleAuthorDto = {
  id: string;
  name: string;
  avatar?: string;
};

export type ArticleCategoryDto = {
  id: string;
  title: string;
  slug: string;
};

export type ArticlePublicDto = {
  id: string;
  slug: string;

  status: ArticleStatus;

  title: string;
  subtitle?: string;

  summary: string;
  content: string;

  tags: string[];

  coverImage?: CoverImageDto;

  language: 'uk' | 'ru' | 'en';

  authorId: string;
  categoryId: string;

  // optional populate outputs (если репо/сервис запопулят)
  author?: ArticleAuthorDto;
  category?: ArticleCategoryDto;

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ArticleListItemDto = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverUrl?: string;
  publishedAt?: string;
  tags: string[];
  category?: Pick<ArticleCategoryDto, 'id' | 'title' | 'slug'>;
};
