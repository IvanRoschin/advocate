import type { Types } from 'mongoose';

import { toIdString, toIsoString } from '@/app/lib/mappers/_utils';
import type { ReviewResponseDTO } from './review.dto';

type ReviewLike = {
  _id: Types.ObjectId | string;
  authorName: string;
  text: string;
  rating?: number | null;
  status: ReviewResponseDTO['status'];
  targetType: ReviewResponseDTO['targetType'];
  targetId?: Types.ObjectId | string | null;
  pageKey?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

export const mapReviewToResponse = (review: ReviewLike): ReviewResponseDTO => ({
  _id: toIdString(review._id),
  authorName: review.authorName,
  text: review.text,
  rating: typeof review.rating === 'number' ? review.rating : undefined,
  status: review.status,
  targetType: review.targetType,
  targetId: review.targetId ? toIdString(review.targetId) : undefined,
  pageKey: review.pageKey ?? undefined,
  createdAt: toIsoString(review.createdAt),
  updatedAt: toIsoString(review.updatedAt),
});
