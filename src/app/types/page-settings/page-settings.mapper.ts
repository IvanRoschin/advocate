import type {
  ArticleLayoutItemInput,
  ArticleLayoutNodeInput,
  ArticleSectionKey,
} from '@/app/types';

const ARTICLE_SECTION_KEYS: ArticleSectionKey[] = [
  'hero',
  'content',
  'share',
  'related',
  'toc',
  'reviews',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isArticleSectionKey = (value: unknown): value is ArticleSectionKey =>
  typeof value === 'string' &&
  ARTICLE_SECTION_KEYS.includes(value as ArticleSectionKey);

const toTrimmedString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const toBoolean = (value: unknown, fallback = true): boolean =>
  typeof value === 'boolean' ? value : fallback;

const normalizeArticleLayoutItem = (
  value: unknown
): ArticleLayoutItemInput | null => {
  if (!isRecord(value)) return null;
  if (!isArticleSectionKey(value.key)) return null;

  return {
    key: value.key,
    display: toBoolean(value.display, true),
  };
};

const normalizeArticleLayoutNode = (
  value: unknown
): ArticleLayoutNodeInput | null => {
  if (!isRecord(value)) return null;

  const type = value.type;
  const display = toBoolean(value.display, true);

  if (type === 'section') {
    if (!isArticleSectionKey(value.key)) return null;

    return {
      type: 'section',
      key: value.key,
      display,
    };
  }

  if (type === 'group') {
    const key = toTrimmedString(value.key);
    if (!key) return null;

    const items = Array.isArray(value.items)
      ? value.items
          .map(normalizeArticleLayoutItem)
          .filter((item): item is ArticleLayoutItemInput => item !== null)
      : [];

    return {
      type: 'group',
      key,
      display,
      wrapperClassName: toTrimmedString(value.wrapperClassName) || undefined,
      items,
    };
  }

  return null;
};

export const normalizeArticleLayout = (
  value: unknown
): ArticleLayoutNodeInput[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map(normalizeArticleLayoutNode)
    .filter((node): node is ArticleLayoutNodeInput => node !== null);
};
