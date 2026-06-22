'use server';

import { Types } from 'mongoose';

import { reviewRepo } from '@/app/lib/repositories/review.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';
import {
  CreateReviewRequestDTO,
  mapReviewToResponse,
  ReviewTargetType,
  UpdateReviewDTO,
} from '@/app/types';

/* ---------------- utils ---------------- */

const assertObjectId = (id: string, fieldName = 'id') => {
  if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
    throw new ValidationError(`Невірний ${fieldName}`);
  }
};

/* ---------------- target normalization ---------------- */

type NormalizedTarget = {
  targetType: ReviewTargetType;
  targetId?: string;
  pageKey?: string;
};

const normalizeTarget = (data: CreateReviewRequestDTO): NormalizedTarget => {
  if (data.targetType === 'page') {
    return {
      targetType: 'page',
      targetId: undefined,
      pageKey: data.pageKey?.trim() || undefined,
    };
  }

  if (data.targetId) {
    assertObjectId(data.targetId, 'targetId');
  }

  return {
    targetType: data.targetType,
    targetId: data.targetId?.trim() || undefined,
    pageKey: undefined,
  };
};

/* =========================================================
   PUBLIC READ ACTIONS
   ========================================================= */

export async function getAllReviews() {
  const reviews = await reviewRepo.findAll();
  return reviews.map(mapReviewToResponse);
}

export async function getReviewById(id: string) {
  await dbConnect();

  assertObjectId(id);

  const review = await reviewRepo.findById(id).lean();

  if (!review) {
    throw new ValidationError('Відгук не знайдено');
  }

  return mapReviewToResponse(review);
}

export async function getApprovedReviewsByTarget(params: {
  targetType: ReviewTargetType;
  targetId?: string;
  pageKey?: string;
  limit?: number;
}) {
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

  assertObjectId(params.targetId!, 'targetId');

  const reviews = await reviewRepo.findApprovedByTarget({
    targetType: params.targetType,
    targetId: params.targetId!,
    limit,
  });

  return reviews.map(mapReviewToResponse);
}

/* =========================================================
   WRITE ACTIONS
   ========================================================= */

export async function createReview(data: CreateReviewRequestDTO) {
  await dbConnect();

  const normalizedTarget = normalizeTarget(data);

  const created = await reviewRepo.create({
    ...data,
    ...normalizedTarget,
  });

  return mapReviewToResponse(created.toObject());
}

export async function updateReview(id: string, data: UpdateReviewDTO) {
  await dbConnect();

  assertObjectId(id);

  const review = await reviewRepo.findById(id);

  if (!review) {
    throw new ValidationError('Відгук не знайдено');
  }

  const nextTargetType = data.targetType ?? review.targetType;

  const normalizedTarget = normalizeTarget({
    targetType: nextTargetType,
    targetId:
      data.targetId !== undefined ? data.targetId : review.targetId?.toString(),
    pageKey: data.pageKey !== undefined ? data.pageKey : review.pageKey,
    authorName: '',
    text: '',
    status: 'pending',
  });

  const patch = {
    ...(data.authorName !== undefined && { authorName: data.authorName }),
    ...(data.text !== undefined && { text: data.text }),
    ...(data.rating !== undefined && { rating: data.rating }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.targetType !== undefined && { targetType: data.targetType }),

    targetId: normalizedTarget.targetId
      ? new Types.ObjectId(normalizedTarget.targetId)
      : undefined,

    pageKey: normalizedTarget.pageKey,
  };

  Object.assign(review, patch);

  await review.save();

  return mapReviewToResponse(review.toObject());
}

export async function deleteReview(id: string) {
  await dbConnect();

  assertObjectId(id);

  const deleted = await reviewRepo.deleteById(id);

  if (!deleted) {
    throw new ValidationError('Відгук не знайдено');
  }

  return { ok: true };
}
