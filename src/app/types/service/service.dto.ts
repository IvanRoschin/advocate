export type ServiceStatus = 'draft' | 'published';

export type ServiceSectionKey =
  | 'header'
  | 'hero'
  | 'benefits'
  | 'process'
  | 'faq'
  | 'cta'
  | 'reviews'
  | 'footer';

export type ServiceLayoutItemInput = {
  key: ServiceSectionKey;
  display: boolean;
};

export type ServiceSectionLayoutInput = {
  type: 'section';
  key: ServiceSectionKey;
  display: boolean;
};

export type ServiceGroupLayoutInput = {
  type: 'group';
  key: string;
  display: boolean;
  wrapperClassName?: string;
  items: ServiceLayoutItemInput[];
};

export type ServiceLayoutNodeInput =
  | ServiceSectionLayoutInput
  | ServiceGroupLayoutInput;

export type ServiceLayoutNode =
  | {
      type: 'section';
      key: ServiceSectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{
        key: ServiceSectionKey;
        display: boolean;
      }>;
    };

export type ServiceHeroDto = {
  title: string;
  description: string;
  src: string[];
};

export type ServiceBenefitsItemDto = {
  title: string;
  description: string;
};

export type ServiceBenefitsDto = {
  title: string;
  items: ServiceBenefitsItemDto[];
};

export type ServiceProcessStepDto = {
  title: string;
  description: string;
};

export type ServiceProcessDto = {
  title: string;
  steps: ServiceProcessStepDto[];
};

export type ServiceFaqItemDto = {
  question: string;
  answer: string;
};

export type ServiceFaqDto = {
  title: string;
  items: ServiceFaqItemDto[];
};

export type ServiceCtaDto = {
  title: string;
  description: string;
  buttonLabel: string;
};

export type ServiceSectionsDto = {
  hero?: ServiceHeroDto;
  benefits?: ServiceBenefitsDto;
  process?: ServiceProcessDto;
  faq?: ServiceFaqDto;
  cta?: ServiceCtaDto;
};

export type RelatedArticleRef = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  src?: string;
};

export type ServiceResponseDTO = {
  _id: string;

  slug: string;
  status: ServiceStatus;

  title: string;
  summary: string;

  src: string[];

  layout: ServiceLayoutNode[];
  sections: ServiceSectionsDto;

  seoTitle: string;
  seoDescription: string;

  relatedArticles: string[];

  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateServiceRequestDTO = {
  title: string;
  summary: string;

  status: ServiceStatus;

  src?: string[];
  slug?: string;

  layout: ServiceLayoutNodeInput[];
  sections: ServiceSectionsDto;

  seoTitle: string;
  seoDescription: string;

  relatedArticles?: string[];
};

export type UpdateServiceDTO = Partial<Omit<CreateServiceRequestDTO, 'src'>> & {
  src?: string[] | null;
};

export type ServiceListItemDto = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  src?: string;
};

export type ServicePublicPageDto = {
  id: string;
  slug: string;

  status: ServiceStatus;

  title: string;
  summary: string;

  src: string[];

  layout: ServiceLayoutNode[];
  sections: ServiceSectionsDto;

  seoTitle: string;
  seoDescription: string;

  relatedArticles: RelatedArticleRef[];

  publishedAt?: string;
  updatedAt?: string;
};
