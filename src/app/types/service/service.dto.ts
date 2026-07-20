export type ServiceStatus = 'draft' | 'published';

export type ServiceSectionKey =
  | 'header'
  | 'hero'
  | 'benefits'
  | 'process'
  | 'faq'
  | 'relatedArticles'
  | 'reviews'
  | 'cta'
  | 'footer';

type ServiceLayoutItemInput = {
  key: ServiceSectionKey;
  display: boolean;
};

type ServiceSectionLayoutInput = {
  type: 'section';
  key: ServiceSectionKey;
  display: boolean;
};

type ServiceGroupLayoutInput = {
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

type ServiceHeroDto = {
  title: string;
  description: string;
  src: string[];
};

type ServiceBenefitsItemDto = {
  title: string;
  description: string;
};

type ServiceBenefitsDto = {
  title: string;
  items: ServiceBenefitsItemDto[];
};

type ServiceProcessStepDto = {
  title: string;
  description: string;
};

type ServiceProcessDto = {
  title: string;
  steps: ServiceProcessStepDto[];
};

type ServiceFaqItemDto = {
  question: string;
  answer: string;
};

type ServiceFaqDto = {
  title: string;
  items: ServiceFaqItemDto[];
};

type ServiceCtaDto = {
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

type RelatedArticleRef = {
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
