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

export type PageLayoutNodeInput = PageSectionLayoutInput | PageGroupLayoutInput;

export type PageLayoutNode = PageLayoutNodeInput;

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
