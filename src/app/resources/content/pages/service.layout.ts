import { LayoutNode } from '@/app/lib/layouts/renderLayout';

export type ServiceSectionKey =
  | 'header'
  | 'hero'
  | 'benefits'
  | 'process'
  | 'faq'
  | 'reviews'
  | 'cta'
  | 'relatedArticles'
  | 'footer';

export const defaultServiceLayout: LayoutNode<ServiceSectionKey>[] = [
  { type: 'section', key: 'header', display: true },
  { type: 'section', key: 'hero', display: true },
  {
    type: 'group',
    key: 'serviceMainContent',
    display: true,
    wrapperClassName: 'container py-10 lg:py-14 space-y-10',
    items: [
      { key: 'benefits', display: true },
      { key: 'process', display: true },
      { key: 'faq', display: true },
      { key: 'reviews', display: true },
      { key: 'cta', display: true },
      { key: 'relatedArticles', display: true },
    ],
  },
  { type: 'section', key: 'footer', display: true },
];
