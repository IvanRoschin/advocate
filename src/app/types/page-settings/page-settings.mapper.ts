import type {
  PageLayoutItemInput,
  PageLayoutNodeInput,
  PageSectionKey,
} from '@/app/types';

const PAGE_SECTION_KEYS: PageSectionKey[] = [
  'header',
  'hero',
  'content',
  'share',
  'related',
  'toc',
  'reviews',
  'benefits',
  'process',
  'faq',
  'cta',
  'footer',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isPageSectionKey = (value: unknown): value is PageSectionKey =>
  typeof value === 'string' &&
  PAGE_SECTION_KEYS.includes(value as PageSectionKey);

const toTrimmedString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const toBoolean = (value: unknown, fallback = true): boolean =>
  typeof value === 'boolean' ? value : fallback;

const normalizePageLayoutItem = (
  value: unknown
): PageLayoutItemInput | null => {
  if (!isRecord(value)) return null;
  if (!isPageSectionKey(value.key)) return null;

  return {
    key: value.key,
    display: toBoolean(value.display, true),
  };
};

const normalizePageLayoutNode = (
  value: unknown
): PageLayoutNodeInput | null => {
  if (!isRecord(value)) return null;

  const type = value.type;
  const display = toBoolean(value.display, true);

  if (type === 'section') {
    if (!isPageSectionKey(value.key)) return null;

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
          .map(normalizePageLayoutItem)
          .filter((item): item is PageLayoutItemInput => item !== null)
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

export const normalizePageLayout = (value: unknown): PageLayoutNodeInput[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map(normalizePageLayoutNode)
    .filter((node): node is PageLayoutNodeInput => node !== null);
};
