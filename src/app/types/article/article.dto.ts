export type ArticleStatus = 'draft' | 'published';
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

  // optional populate
  author?: ArticleAuthorDto;
  category?: ArticleCategoryDto;

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

/* -------------------------- Optional frontend/public DTO -------------------------- */
/**
 * Если хочешь удобный фронтовый тип с id (а не _id),
 * чтобы не переписывать таблицы/формы:
 */
export type ArticlePublicDto = Omit<
  ArticleResponseDTO,
  '_id' | 'author' | 'category'
> & {
  id: string;
  author?: { id: string; name: string; avatar?: string };
  category?: { id: string; title: string; slug: string };
};

export type ArticleListItemDto = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  src?: string;
  publishedAt?: string;
  tags: string[];
  category?: { id: string; title: string; slug: string };
};
