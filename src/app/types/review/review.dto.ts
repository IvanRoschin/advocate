export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type ReviewTargetType = 'service' | 'article' | 'page';

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
