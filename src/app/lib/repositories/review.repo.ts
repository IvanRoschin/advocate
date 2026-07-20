import { Types } from 'mongoose';

import { Review } from '@/app/models';
import type {
  CreateReviewRequestDTO,
  ReviewResponseDTO,
  UpdateReviewDTO,
} from '@/app/types';
import { createQuery } from './queryFactory';
const PUBLIC_SORT = { createdAt: -1, _id: -1 } as const;

const reviewQuery = createQuery(Review);

/* ========================= REPOSITORY ========================= */

export const reviewRepo = {
  /* ================= CRUD ================= */

  async findAll(): Promise<ReviewResponseDTO[]> {
    return Review.find().sort({ createdAt: -1 }).lean<ReviewResponseDTO[]>();
  },

  async findAllPaginated(page: number, limit: number) {
    return reviewQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount<ReviewResponseDTO>();
  },

  async findById(id: string) {
    return Review.findById(id);
  },

  async create(data: CreateReviewRequestDTO) {
    return Review.create({
      ...data,
      targetId: data.targetId ? new Types.ObjectId(data.targetId) : undefined,
    });
  },

  async update(id: string, data: UpdateReviewDTO) {
    return Review.findByIdAndUpdate(
      id,
      {
        ...data,
        ...(data.targetId !== undefined && {
          targetId: data.targetId
            ? new Types.ObjectId(data.targetId)
            : undefined,
        }),
      },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    ).lean<ReviewResponseDTO>();
  },

  async deleteById(id: string) {
    return Review.findByIdAndDelete(id);
  },
};

/* ========================= PUBLIC QUERIES ========================= */

export const reviewQueries = {
  async list(args: {
    page?: number;
    limit?: number;
    targetType?: 'service' | 'article' | 'page';
    targetId?: string;
    pageKey?: string;
  }) {
    const page = Math.max(1, args.page ?? 1);
    const limit = Math.max(1, args.limit ?? 10);

    return reviewQuery()
      .where({
        status: 'approved',
        ...(args.targetType ? { targetType: args.targetType } : {}),
        ...(args.targetId
          ? { targetId: new Types.ObjectId(args.targetId) }
          : {}),
        ...(args.pageKey ? { pageKey: args.pageKey } : {}),
      })
      .sortBy(PUBLIC_SORT)
      .paginate(page, limit)
      .execWithCount<ReviewResponseDTO>();
  },

  async recent(limit = 5) {
    return Review.find({ status: 'approved' })
      .sort(PUBLIC_SORT)
      .limit(limit)
      .lean<ReviewResponseDTO[]>();
  },

  async countByTarget(
    targetType: 'service' | 'article' | 'page',
    targetId?: string,
    pageKey?: string
  ) {
    return Review.countDocuments({
      status: 'approved',
      targetType,
      ...(targetId ? { targetId: new Types.ObjectId(targetId) } : {}),
      ...(pageKey ? { pageKey } : {}),
    });
  },

  async averageRating(
    targetType: 'service' | 'article' | 'page',
    targetId?: string,
    pageKey?: string
  ) {
    const [result] = await Review.aggregate<{
      average: number;
      count: number;
    }>([
      {
        $match: {
          status: 'approved',
          rating: { $exists: true },
          targetType,
          ...(targetId ? { targetId: new Types.ObjectId(targetId) } : {}),
          ...(pageKey ? { pageKey } : {}),
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      average: result?.average ?? 0,
      count: result?.count ?? 0,
    };
  },
};
