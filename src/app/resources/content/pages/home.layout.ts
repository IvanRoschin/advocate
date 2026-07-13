import { LayoutNode } from '@/app/lib/layouts/renderLayout';

export type HomeSectionKey =
  | 'socials'
  | 'header'
  | 'hero'
  | 'services'
  | 'about'
  | 'practices'
  | 'advantages'
  | 'reviews'
  | 'whyChooseMe'
  | 'order'
  | 'footer'
  | 'scrollToTop';

export const defaultHomeLayout: LayoutNode<HomeSectionKey>[] = [
  { type: 'section', key: 'socials', display: true },
  { type: 'section', key: 'header', display: true },

  {
    type: 'group',
    key: 'heroStack',
    display: true,
    wrapperClassName: 'relative',
    items: [
      { key: 'hero', display: true },
      { key: 'services', display: true },
    ],
  },

  { type: 'section', key: 'about', display: true },
  { type: 'section', key: 'practices', display: true },
  { type: 'section', key: 'advantages', display: true },
  { type: 'section', key: 'reviews', display: true },
  { type: 'section', key: 'whyChooseMe', display: true },
  { type: 'section', key: 'order', display: true },
  { type: 'section', key: 'footer', display: true },
  { type: 'section', key: 'scrollToTop', display: true },
];
