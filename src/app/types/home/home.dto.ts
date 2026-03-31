export type HomeStatus = 'draft' | 'published';

export type HomeSectionKey =
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
  | 'socials'
  | 'scrollToTop';

export type HomeLayoutItemInput = {
  key: HomeSectionKey;
  display: boolean;
};

export type HomeSectionLayoutInput = {
  type: 'section';
  key: HomeSectionKey;
  display: boolean;
};

export type HomeGroupLayoutInput = {
  type: 'group';
  key: string;
  display: boolean;
  wrapperClassName?: string;
  items: HomeLayoutItemInput[];
};

export type HomeLayoutNodeInput = HomeSectionLayoutInput | HomeGroupLayoutInput;

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
      items: Array<{
        key: HomeSectionKey;
        display: boolean;
      }>;
    };
