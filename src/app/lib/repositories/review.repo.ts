import mongoose from 'mongoose';

import Review from '@/models/Review';

import { dbConnect } from '../server/mongoose';

type CreateReviewRepoInput = {
  authorName: string;
  text: string;
  rating?: number;
  status: 'pending' | 'approved' | 'rejected';
  targetType: 'service' | 'article' | 'page';
  targetId?: string;
  pageKey?: 'home';
};

export const reviewRepository = {
  async create(input: CreateReviewRepoInput) {
    await dbConnect();

    return Review.create({
      ...input,
      targetId: input.targetId
        ? new mongoose.Types.ObjectId(input.targetId)
        : undefined,
    });
  },

  async findApprovedByTarget(input: {
    targetType: 'service' | 'article' | 'page';
    targetId?: string;
    pageKey?: 'home';
  }) {
    await dbConnect();

    return Review.find({
      status: 'approved',
      targetType: input.targetType,
      ...(input.targetId
        ? { targetId: new mongoose.Types.ObjectId(input.targetId) }
        : {}),
      ...(input.pageKey ? { pageKey: input.pageKey } : {}),
    })
      .sort({ createdAt: -1 })
      .lean();
  },
};
