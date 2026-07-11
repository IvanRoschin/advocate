export type PageSectionKey =
  | 'socials'
  | 'header'
  | 'hero'
  | 'services'
  | 'about'
  | 'practices'
  | 'advantages'
  | 'content'
  | 'share'
  | 'related'
  | 'toc'
  | 'reviews'
  | 'benefits'
  | 'process'
  | 'faq'
  | 'cta'
  | 'relatedArticles'
  | 'serviceLink'
  | 'whyChooseMe'
  | 'order'
  | 'footer'
  | 'scrollToTop';

export type PageLayoutItemInput = {
  key: PageSectionKey;
  display: boolean;
};

export type PageSectionLayoutInput = {
  type: 'section';
  key: PageSectionKey;
  display: boolean;
};

export type PageGroupLayoutInput = {
  type: 'group';
  key: string;
  display: boolean;
  wrapperClassName?: string;
  items: PageLayoutItemInput[];
};

// Для БД / DTO — key: string (уже есть)
export type PageLayoutNode =
  | { type: 'section'; key: string; display: boolean }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{ key: string; display: boolean }>;
    };

// Для рендера — сужаем key до конкретного union
export type TypedLayoutNode<TKey extends string> =
  | { type: 'section'; key: TKey; display: boolean }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{ key: TKey; display: boolean }>;
    };

export type PageSettingsEntity = 'article' | 'service' | 'home';

export type PageSettingsResponseDTO = {
  _id: string;
  entity: PageSettingsEntity;
  layout: PageLayoutNode[];
  createdAt?: string;
  updatedAt?: string;
};

export type UpdatePageSettingsDTO = {
  entity: PageSettingsEntity;
  layout: PageLayoutNode[];
};
