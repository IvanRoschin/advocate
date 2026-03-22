import Review from '@/app/models/Review';

import type { CreateReviewRequestDTO, ReviewTargetType } from '@/app/types';

type FindApprovedByTargetParams =
  | {
      targetType: 'page';
      pageKey: string;
      targetId?: never;
      limit?: number;
    }
  | {
      targetType: Exclude<ReviewTargetType, 'page'>;
      targetId: string;
      pageKey?: never;
      limit?: number;
    };

export const reviewRepo = {
  findAll() {
    return Review.find().sort({ createdAt: -1 }).lean();
  },

  findById(id: string) {
    return Review.findById(id);
  },

  create(data: CreateReviewRequestDTO) {
    return Review.create(data);
  },

  deleteById(id: string) {
    return Review.findByIdAndDelete(id);
  },

  findApprovedByTarget(params: FindApprovedByTargetParams) {
    const limit = params.limit ?? 4;

    if (params.targetType === 'page') {
      return Review.find({
        targetType: 'page',
        pageKey: params.pageKey,
        status: 'approved',
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    }

    return Review.find({
      targetType: params.targetType,
      targetId: params.targetId,
      status: 'approved',
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  },
};
