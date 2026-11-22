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
  | 'process'
  | 'faq'
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

  // About одразу після hero: його верхній відступ розрахований під картки
  // Services, що накладаються на низ банера.
  { type: 'section', key: 'about', display: true },
  { type: 'section', key: 'whyChooseMe', display: true },
  { type: 'section', key: 'process', display: true },
  { type: 'section', key: 'advantages', display: true },
  { type: 'section', key: 'reviews', display: true },
  // Практики дублювали картки напрямів під банером — приховано за
  // замовчуванням; повний каталог доступний на /services.
  { type: 'section', key: 'practices', display: false },
  { type: 'section', key: 'faq', display: true },
  { type: 'section', key: 'order', display: true },
  { type: 'section', key: 'footer', display: true },
  { type: 'section', key: 'scrollToTop', display: true },
];
