export type BlogSectionKey =
  | 'socials'
  | 'header'
  | 'hero'
  | 'filters'
  | 'articles'
  | 'pagination'
  | 'subscribe'
  | 'footer'
  | 'scrollToTop';

export type BlogLayoutNode =
  | {
      type: 'section';
      key: BlogSectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{ key: BlogSectionKey; display: boolean }>;
    };

export const blogLayout: BlogLayoutNode[] = [
  { type: 'section', key: 'socials', display: true },
  { type: 'section', key: 'header', display: true },
  { type: 'section', key: 'hero', display: true },
  {
    type: 'group',
    key: 'blogContent',
    display: true,
    wrapperClassName: 'container py-10 lg:py-14',
    items: [
      { key: 'articles', display: true },
      { key: 'filters', display: true },
      { key: 'pagination', display: true },
    ],
  },
  { type: 'section', key: 'subscribe', display: true },
  { type: 'section', key: 'footer', display: true },
  { type: 'section', key: 'scrollToTop', display: true },
];
