import type { Types } from 'mongoose';

import type {
  ArticleLanguage,
  ArticlePublicDto,
  ArticleResponseDTO,
  ArticleStatus,
  CoverImageDto,
  CreateArticleRequestDTO,
  UpdateArticleDTO,
} from './article.dto';

/* --------------------------------- Models -------------------------------- */

type ArticleLike = {
  _id: Types.ObjectId | string;

  slug: string;
  status: ArticleStatus;

  title: string;
  subtitle?: string | null;

  summary: string;
  content: string;

  tags?: unknown;
  src?: unknown;

  language: ArticleLanguage;

  authorId: Types.ObjectId | string;
  categoryId: Types.ObjectId | string;

  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

/* -------------------------------- Utilities ------------------------------- */

export const toIdString = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && v !== null && 'toString' in v) {
    return (v as { toString(): string }).toString();
  }
  return String(v);
};

export const toIsoString = (v: unknown): string | undefined => {
  if (v == null || v === '') return undefined;

  if (v instanceof Date) {
    return Number.isNaN(v.getTime()) ? undefined : v.toISOString();
  }

  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }

  // fallback: ObjectId-like or custom objects
  if (typeof v === 'object') {
    const obj = v as { valueOf?: () => unknown; toString?: () => string };
    const prim = obj.valueOf?.();

    if (typeof prim === 'string' || typeof prim === 'number') {
      const d = new Date(prim);
      return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
    }

    if (typeof obj.toString === 'function') {
      const s = obj.toString();
      const d = new Date(s);
      return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
    }
  }

  return undefined;
};

const parseStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter(x => typeof x === 'string') : [];

const sameArray = (
  a?: readonly string[] | null,
  b?: readonly string[] | null
) => {
  const aa = a ?? [];
  const bb = b ?? [];
  if (aa.length !== bb.length) return false;
  for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
  return true;
};

/* ------------------------------- API Mappers ------------------------------ */

/**
 * ✅ Admin API response: строго соответствует ArticleResponseDTO (с _id).
 * Никаких id тут НЕ добавляем — это отдельный public-тип.
 */
export function mapArticleToResponse(article: ArticleLike): ArticleResponseDTO {
  return {
    _id: toIdString(article._id),

    slug: article.slug,
    status: article.status,

    title: article.title,
    subtitle: article.subtitle ?? undefined,

    summary: article.summary,
    content: article.content,

    tags: parseStringArray(article.tags),
    src: parseStringArray(article.src),

    language: article.language,

    authorId: toIdString(article.authorId),
    categoryId: toIdString(article.categoryId),

    publishedAt: toIsoString(article.publishedAt),
    createdAt: toIsoString(article.createdAt),
    updatedAt: toIsoString(article.updatedAt),
  };
}

/**
 * ✅ Frontend/public удобный тип: добавляет id вместо _id.
 * Используй это для UI (таблицы, роутинг), чтобы НЕ путать _id/id.
 */
export function mapArticleResponseToPublic(
  a: ArticleResponseDTO
): ArticlePublicDto {
  return {
    ...a,
    id: a._id,
    author: a.author
      ? { id: a.author._id, name: a.author.name, avatar: a.author.avatar }
      : undefined,
    category: a.category
      ? { id: a.category._id, title: a.category.title, slug: a.category.slug }
      : undefined,
  };
}

/* ----------------------------- Form helpers ------------------------------ */

export type ArticleFormValues = Omit<
  CreateArticleRequestDTO,
  'src' | 'tags' | 'subtitle' | 'slug'
> & {
  slug?: string;
  subtitle?: string;
  tags: string[]; // хранится отдельно, но мы используем tagsInput как источник правды
  tagsInput: string;
  src: CoverImageDto | null; // null = "очистить" (для PATCH)
  slugTouchedManually: boolean;
};

export const parseTagsInput = (raw: string): string[] =>
  raw
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

/**
 * ✅ Нормализация под CREATE:
 * - src всегда массив (null -> [])
 * - slug не шлём, если пустой
 * - subtitle не шлём, если пустая строка
 * - tags берём из tagsInput (если введено), иначе из tags
 */
export const normalizeArticleForCreate = (
  v: ArticleFormValues
): CreateArticleRequestDTO => {
  const slug = v.slug?.trim() ?? '';
  const subtitle = v.subtitle?.trim() ?? '';

  const tags =
    v.tagsInput?.trim().length > 0
      ? parseTagsInput(v.tagsInput)
      : (v.tags ?? []);

  return {
    ...(slug ? { slug } : {}),

    status: v.status,
    title: v.title.trim(),
    ...(subtitle ? { subtitle } : {}),

    summary: v.summary.trim(),
    content: v.content,

    tags,
    src: v.src === null ? [] : (v.src ?? []),

    language: v.language,
    authorId: v.authorId,
    categoryId: v.categoryId,
  };
};

/**
 * ✅ Нормализация под PATCH:
 * - src сохраняем как `string[] | null` (null = "очистить")
 * - остальное как в CREATE, но без принудительных дефолтов, которые ломают diff
 */
type NormalizedForPatch = Omit<
  CreateArticleRequestDTO,
  'src' | 'slug' | 'subtitle'
> & {
  slug?: string;
  subtitle?: string; // пустая строка допустима для очистки
  src: CoverImageDto | null;
};

export const normalizeArticleForPatch = (
  v: ArticleFormValues
): NormalizedForPatch => {
  const slug = v.slug?.trim() ?? '';
  const subtitleRaw = v.subtitle ?? '';
  const subtitle = subtitleRaw.trim();

  const tags =
    v.tagsInput?.trim().length > 0
      ? parseTagsInput(v.tagsInput)
      : (v.tags ?? []);

  return {
    ...(slug ? { slug } : {}),

    status: v.status,
    title: v.title.trim(),

    // В PATCH мы хотим уметь очищать subtitle:
    // если поле в UI стало пустым — отправляем '' (а не undefined)
    subtitle: subtitleRaw === '' ? '' : subtitle,

    summary: v.summary.trim(),
    content: v.content,

    tags,
    src: v.src === null ? null : (v.src ?? []),

    language: v.language,
    authorId: v.authorId,
    categoryId: v.categoryId,
  };
};

/**
 * ✅ PATCH builder:
 * - slug: не шлём пустой
 * - subtitle: шлём '' чтобы очистить (если изменилось)
 * - src: шлём null чтобы очистить; [] чтобы установить пустой; undefined чтобы не менять
 */
export const buildArticlePatch = (
  initial: ArticleFormValues,
  current: ArticleFormValues
): UpdateArticleDTO => {
  const i = normalizeArticleForPatch(initial);
  const c = normalizeArticleForPatch(current);

  const patch: UpdateArticleDTO = {};

  // slug: если очистили — НЕ шлём пустоту (оставим как было на сервере)
  const iSlug = i.slug ?? '';
  const cSlug = c.slug ?? '';
  if (cSlug !== iSlug) {
    if (cSlug) patch.slug = cSlug;
  }

  if (c.status !== i.status) patch.status = c.status;
  if (c.title !== i.title) patch.title = c.title;

  if ((c.subtitle ?? '') !== (i.subtitle ?? '')) {
    patch.subtitle = c.subtitle; // может быть '' (очистка)
  }

  if (c.summary !== i.summary) patch.summary = c.summary;
  if (c.content !== i.content) patch.content = c.content;

  if (c.language !== i.language) patch.language = c.language;
  if (c.authorId !== i.authorId) patch.authorId = c.authorId;
  if (c.categoryId !== i.categoryId) patch.categoryId = c.categoryId;

  if (!sameArray(c.tags, i.tags)) patch.tags = c.tags;

  // src: null = очистить
  const iSrc = i.src;
  const cSrc = c.src;

  const srcChanged =
    (iSrc === null) !== (cSrc === null) ||
    (iSrc !== null && cSrc !== null && !sameArray(cSrc, iSrc));

  if (srcChanged) {
    patch.src = cSrc; // string[] | null
  }

  return patch;
};

export const mapArticleResponseToFormValues = (
  a: ArticleResponseDTO
): ArticleFormValues => ({
  slug: a.slug ?? '',
  status: a.status,
  title: a.title ?? '',
  subtitle: a.subtitle ?? '',
  summary: a.summary ?? '',
  content: a.content ?? '',

  tags: a.tags ?? [],
  tagsInput: (a.tags ?? []).join(', '),

  src: a.src ?? [],

  language: a.language,
  authorId: a.authorId,
  categoryId: a.categoryId,

  slugTouchedManually: false,
});
