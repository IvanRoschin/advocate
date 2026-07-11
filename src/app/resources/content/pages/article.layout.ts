import { LayoutNode } from '@/app/lib/layouts/renderLayout';

export type ArticleSectionKey =
  | 'header'
  | 'hero'
  | 'content'
  | 'share'
  | 'related'
  | 'toc'
  | 'reviews'
  | 'serviceLink'
  | 'footer';

export const defaultArticleLayout: LayoutNode<ArticleSectionKey>[] = [
  { type: 'section', key: 'header', display: true },
  { type: 'section', key: 'hero', display: true },
  {
    type: 'group',
    key: 'articleMainContent',
    display: true,
    wrapperClassName: 'container py-10 lg:py-14 space-y-10',
    items: [
      { key: 'content', display: true },
      { key: 'share', display: true },
      { key: 'related', display: true },
      { key: 'toc', display: true },
      { key: 'reviews', display: true },
      { key: 'serviceLink', display: true },
    ],
  },
  { type: 'section', key: 'footer', display: true },
];
