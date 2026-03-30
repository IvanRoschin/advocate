import type { ArticleLayoutNode } from '@/app/types';

export const defaultArticleLayout: ArticleLayoutNode[] = [
  {
    type: 'section',
    key: 'hero',
    display: true,
  },
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
    ],
  },
];
