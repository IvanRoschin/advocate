export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type ReviewTargetType = 'service' | 'article' | 'page';

export type ReviewPageKey = 'home';

export type CreateReviewRequestDTO = {
  authorName: string;
  text: string;
  rating?: number;

  targetType: ReviewTargetType;
  targetId?: string;
  pageKey?: ReviewPageKey;
};

export type CreateAdminReviewDTO = CreateReviewRequestDTO & {
  status?: ReviewStatus;
};

export type UpdateReviewDTO = Partial<{
  authorName: string;
  text: string;
  rating: number;
  status: ReviewStatus;
}>;

export type ReviewResponseDTO = {
  _id: string;
  authorName: string;
  text: string;
  rating?: number;

  status: ReviewStatus;

  targetType: ReviewTargetType;
  targetId?: string;
  pageKey?: ReviewPageKey;

  createdAt?: string;
  updatedAt?: string;
};
