import {
  CreateReviewRequestDTO,
  mapReviewToResponse,
  ReviewResponseDTO,
} from '@/types';

import { reviewRepository } from '../repositories/review.repo';

type GetApprovedByTargetInput =
  | {
      targetType: 'service' | 'article';
      targetId: string;
    }
  | {
      targetType: 'page';
      pageKey: 'home';
    };

export const reviewService = {
  async create(payload: CreateReviewRequestDTO): Promise<ReviewResponseDTO> {
    if (
      (payload.targetType === 'service' || payload.targetType === 'article') &&
      !payload.targetId
    ) {
      throw new Error('targetId is required');
    }

    if (payload.targetType === 'page' && !payload.pageKey) {
      throw new Error('pageKey is required');
    }

    const created = await reviewRepository.create({
      ...payload,
      status: 'pending',
    });

    return mapReviewToResponse(created);
  },

  async getApprovedByTarget(
    input: GetApprovedByTargetInput
  ): Promise<ReviewResponseDTO[]> {
    const items = await reviewRepository.findApprovedByTarget(input);

    return items.map(mapReviewToResponse);
  },

  async getApprovedForService(serviceId: string): Promise<ReviewResponseDTO[]> {
    const items = await reviewRepository.findApprovedByTarget({
      targetType: 'service',
      targetId: serviceId,
    });

    return items.map(mapReviewToResponse);
  },
};
