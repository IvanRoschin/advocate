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

export type HomeLayoutNode =
  | {
      type: 'section';
      key: HomeSectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{ key: HomeSectionKey; display: boolean }>;
    };

export const defaultHomeLayout: HomeLayoutNode[] = [
  { type: 'section', key: 'socials', display: true },
  { type: 'section', key: 'header', display: true },

  // особая группа Hero + Services (services поверх)
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
