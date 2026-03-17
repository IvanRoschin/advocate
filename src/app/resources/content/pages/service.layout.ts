import type { ServiceLayoutNode } from '@/app/types';

export const serviceLayout: ServiceLayoutNode[] = [
  {
    type: 'section',
    key: 'hero',
    display: true,
  },

  {
    type: 'group',
    key: 'serviceMainContent',
    display: true,
    wrapperClassName: 'container py-10 lg:py-14 space-y-10',
    items: [
      { key: 'benefits', display: true },
      { key: 'process', display: true },
      { key: 'faq', display: true },
    ],
  },

  {
    type: 'section',
    key: 'cta',
    display: true,
  },
];

export const defaultServiceLayout: ServiceLayoutNode[] = [
  { type: 'section', key: 'hero', display: true },
  { type: 'section', key: 'benefits', display: true },
  { type: 'section', key: 'process', display: true },
  { type: 'section', key: 'faq', display: true },
  { type: 'section', key: 'reviews', display: true },
  { type: 'section', key: 'cta', display: true },
];
