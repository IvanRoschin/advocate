export type ArticleStatus = 'draft' | 'published';

export type ArticleSectionKey =
  | 'header'
  | 'hero'
  | 'content'
  | 'share'
  | 'related'
  | 'toc'
  | 'reviews'
  | 'footer';

export type ArticleLayoutItemInput = {
  key: ArticleSectionKey;
  display: boolean;
};

export type ArticleSectionLayoutInput = {
  type: 'section';
  key: ArticleSectionKey;
  display: boolean;
};

export type ArticleGroupLayoutInput = {
  type: 'group';
  key: string;
  display: boolean;
  wrapperClassName?: string;
  items: ArticleLayoutItemInput[];
};

export type ArticleLayoutNodeInput =
  | ArticleSectionLayoutInput
  | ArticleGroupLayoutInput;

export type ArticleLayoutNode =
  | {
      type: 'section';
      key: ArticleSectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{
        key: ArticleSectionKey;
        display: boolean;
      }>;
    };

export type ArticleLanguage = 'uk' | 'ru' | 'en';

export type CoverImageDto = string[];

export type ArticleAuthorDto = {
  _id: string;
  name: string;
  avatar?: string;
};

export type ArticleCategoryDto = {
  _id: string;
  title: string;
  slug: string;
};
export type ArticleServiceDto = {
  _id: string;
  title: string;
  slug: string;
};

/**
 * ✅ API response (admin) — как у CategoryResponseDTO: с _id
 * Это соответствует тому, что реально возвращает Mongo/Mongoose при .lean()
 */
export type ArticleResponseDTO = {
  _id: string;

  slug: string;
  status: ArticleStatus;

  title: string;
  subtitle?: string;

  summary: string;
  content: string;

  tags: string[];
  src: CoverImageDto;

  language: ArticleLanguage;

  authorId: string;
  categoryId: string;
  serviceId: string;

  // optional populate
  author?: ArticleAuthorDto;
  category?: ArticleCategoryDto;
  service?: ArticleServiceDto;

  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * ✅ CREATE — как у Category: четкий набор полей
 * slug/src/subtitle опциональные
 */
export type CreateArticleRequestDTO = {
  title: string;
  summary: string;
  content: string;

  status: ArticleStatus;
  language: ArticleLanguage;

  authorId: string;
  categoryId: string;
  serviceId: string;

  tags: string[];

  subtitle?: string;
  src?: CoverImageDto;
  slug?: string;
};

/**
 * ✅ UPDATE (PATCH) — как у Category: Partial<Create>
 * НО: src поддерживает null (удалить картинки) — это нужно UI и твоему normalizePatch.
 */

export type UpdateArticleDTO = Partial<Omit<CreateArticleRequestDTO, 'src'>> & {
  src?: CoverImageDto | null;
};

export type ArticleListItemDto = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  src?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags: string[];
  category?: { id: string; title: string; slug: string };
  service?: { id: string; title: string; slug: string };
};

export type ArticlePublicPageDto = {
  id: string;
  slug: string;

  title: string;
  subtitle?: string;

  summary: string;
  content: string;

  tags: string[];

  src: string[];

  status: ArticleStatus;
  language: ArticleLanguage;

  publishedAt?: string;

  updatedAt?: string;

  author?: {
    id: string;
    name: string;
    avatar?: string;
  };

  category?: {
    id: string;
    title: string;
    slug: string;
  };

  service?: {
    id: string;
    title: string;
    slug: string;
  };
};

export type BlogCategoryItemDto = {
  id: string;
  title: string;
  slug: string;
  count: number; // сколько published статей
};

export type BlogRecentPostItemDto = {
  id: string;
  slug: string;
  title: string;
  publishedAt?: string;
};
