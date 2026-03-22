import { Types } from 'mongoose';

import { reviewRepo } from '@/app/lib/repositories/review.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import {
  CreateReviewRequestDTO,
  mapReviewToResponse,
  ReviewTargetType,
  UpdateReviewDTO,
} from '@/app/types';
import { dbConnect } from '../server/mongoose';

const assertObjectId = (id: string, fieldName = 'id') => {
  if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
    throw new ValidationError(`Невірний ${fieldName}`);
  }
};

type GetApprovedByTargetParams =
  | {
      targetType: Exclude<ReviewTargetType, 'page'>;
      targetId: string;
      pageKey?: never;
      limit?: number;
    }
  | {
      targetType: 'page';
      pageKey: string;
      targetId?: never;
      limit?: number;
    };

const normalizeTarget = <
  T extends {
    targetType: 'service' | 'article' | 'page';
    targetId?: string;
    pageKey?: string;
  },
>(
  data: T
): T => {
  if (data.targetType === 'page') {
    return {
      ...data,
      targetId: undefined,
      pageKey: data.pageKey?.trim() || undefined,
    };
  }

  if (data.targetId) {
    assertObjectId(data.targetId, 'targetId');
  }

  return {
    ...data,
    targetId: data.targetId?.trim() || undefined,
    pageKey: undefined,
  };
};

export const reviewService = {
  async getAll() {
    await dbConnect();
    const reviews = await reviewRepo.findAll();
    return reviews.map(mapReviewToResponse);
  },

  async getById(id: string) {
    await dbConnect();
    assertObjectId(id);

    const review = await reviewRepo.findById(id).lean();
    if (!review) throw new ValidationError('Відгук не знайдено');

    return mapReviewToResponse(review);
  },

  async getApprovedByTarget(params: GetApprovedByTargetParams) {
    await dbConnect();

    const limit = params.limit ?? 4;

    if (params.targetType === 'page') {
      const pageKey = params.pageKey?.trim();
      if (!pageKey) {
        throw new ValidationError('Невірний pageKey');
      }

      const reviews = await reviewRepo.findApprovedByTarget({
        targetType: 'page',
        pageKey,
        limit,
      });

      return reviews.map(mapReviewToResponse);
    }

    assertObjectId(params.targetId, 'targetId');

    const reviews = await reviewRepo.findApprovedByTarget({
      targetType: params.targetType,
      targetId: params.targetId,
      limit,
    });

    return reviews.map(mapReviewToResponse);
  },

  async create(data: CreateReviewRequestDTO) {
    await dbConnect();

    const normalized = normalizeTarget(data);
    const created = await reviewRepo.create(normalized);

    return mapReviewToResponse(created.toObject());
  },

  async update(id: string, data: UpdateReviewDTO) {
    await dbConnect();
    assertObjectId(id);

    const review = await reviewRepo.findById(id);
    if (!review) throw new ValidationError('Відгук не знайдено');

    const nextTargetType = data.targetType ?? review.targetType;

    const normalized = normalizeTarget({
      targetType: nextTargetType,
      targetId:
        data.targetId !== undefined
          ? data.targetId
          : review.targetId?.toString(),
      pageKey: data.pageKey !== undefined ? data.pageKey : review.pageKey,
    });

    if (data.authorName !== undefined) {
      review.authorName = data.authorName;
    }

    if (data.text !== undefined) {
      review.text = data.text;
    }

    if (data.rating !== undefined) {
      review.rating = data.rating;
    }

    if (data.status !== undefined) {
      review.status = data.status;
    }

    if (data.targetType !== undefined) {
      review.targetType = data.targetType;
    }

    review.targetId = normalized.targetId
      ? new Types.ObjectId(normalized.targetId)
      : undefined;

    review.pageKey = normalized.pageKey;

    await review.save();

    return mapReviewToResponse(review.toObject());
  },

  async delete(id: string) {
    await dbConnect();
    assertObjectId(id);

    const deleted = await reviewRepo.deleteById(id);
    if (!deleted) throw new ValidationError('Відгук не знайдено');

    return { ok: true };
  },
};
