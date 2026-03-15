import mongoose from 'mongoose';

import { Review } from '@/models';

import { CreateReviewRequestDTO, ReviewResponseDTO } from './review.dto';

export function mapReviewToResponse(
  review: typeof Review extends infer T
    ? T extends mongoose.Model<infer U>
      ? U
      : never
    : never
): ReviewResponseDTO {
  return {
    _id: review._id.toString(),
    authorName: review.authorName,
    text: review.text,
    rating: review.rating,
    status: review.status,
    targetType: review.targetType,
    targetId: review.targetId?.toString(),
    pageKey: review.pageKey,
    createdAt: review.createdAt?.toISOString(),
    updatedAt: review.updatedAt?.toISOString(),
  };
}

export function mapCreateRequestToReview(dto: CreateReviewRequestDTO) {
  return {
    authorName: dto.authorName,
    text: dto.text,
    rating: dto.rating,
  };
}
