export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type ReviewTargetType = 'service' | 'article' | 'page';
export type ReviewTargetOptionDto = {
  value: string;
  label: string;
};
export const REVIEW_PAGE_KEYS = [
  'home',
  'about',
  'contacts',
  'services',
  'blog',
] as const;

export type ReviewPageKey = (typeof REVIEW_PAGE_KEYS)[number];

export type ReviewResponseDTO = {
  _id: string;
  authorName: string;
  text: string;
  rating?: number;
  status: ReviewStatus;
  targetType: ReviewTargetType;
  targetId?: string;
  pageKey?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const REVIEW_PAGE_OPTIONS: ReviewTargetOptionDto[] = [
  { value: 'home', label: 'Головна' },
  { value: 'about', label: 'Про адвоката' },
  { value: 'contacts', label: 'Контакти' },
  { value: 'services', label: 'Послуги' },
  { value: 'blog', label: 'Блог' },
];

export type CreateReviewRequestDTO = {
  authorName: string;
  text: string;
  rating?: number;
  status: ReviewStatus;
  targetType: ReviewTargetType;
  targetId?: string;
  pageKey?: string;
};

export type UpdateReviewDTO = Partial<CreateReviewRequestDTO>;
