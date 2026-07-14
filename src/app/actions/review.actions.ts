import { reviewQueries, reviewRepo } from '../lib/repositories/review.repo';
import { ValidationError } from '../lib/server/errors';
import { mapReviewToResponse, ReviewResponseDTO } from '../types';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';
import { createPublicAction } from './createPublicAction';
import { notifyReviewCreated } from './review-notifications.helpers';

export type PublicReviewInput = {
  authorName: string;
  text: string;
  rating: number;
  targetType: 'service' | 'article';
  targetId: string;
  website?: string;
  turnstileToken?: string;
};

type PublicListResult = {
  items: ReviewResponseDTO[];
  total: number;
  hasMore: boolean;
};

export const reviewActions = createEntityModule({
  repo: reviewRepo,

  toDTO: mapReviewToResponse,
  toListDTO: mapReviewToResponse,

  slug: {
    enabled: false,
  },

  validation: {
    notFoundMessage: 'Review not found',
  },
});

function validatePublicReview(args: PublicReviewInput) {
  const authorName = args.authorName?.trim();
  const text = args.text?.trim();

  if (!authorName || authorName.length < 2) {
    throw new ValidationError("Вкажіть ім'я");
  }
  if (!text || text.length < 5) {
    throw new ValidationError('Вкажіть текст відгуку');
  }
  if (!args.rating || args.rating < 1 || args.rating > 5) {
    throw new ValidationError('Оцінка має бути від 1 до 5');
  }
  if (!args.targetId || !['service', 'article'].includes(args.targetType)) {
    throw new ValidationError('Некоректна привʼязка відгуку');
  }

  return {
    authorName,
    text,
    rating: args.rating,
    targetType: args.targetType,
    targetId: args.targetId,
  };
}

export const reviewPublicActions = {
  create: createPublicAction<PublicReviewInput, ReviewResponseDTO>(
    async ({ args }) => {
      const clean = validatePublicReview(args);

      const review = await reviewActions.create({
        ...clean,
        status: 'pending',
      });

      await notifyReviewCreated(clean);

      return review;
    }
  ),

  list: createAction<
    {
      page?: number;
      limit?: number;
      targetType?: 'service' | 'article' | 'page';
      targetId?: string;
      pageKey?: string;
    },
    PublicListResult
  >(
    async ({ args }) => {
      const result = await reviewQueries.list(args);

      return {
        ...result,
        items: result.items.map(mapReviewToResponse),
      };
    },
    { buildFallback: { items: [], total: 0, hasMore: false } }
  ),

  recent: createAction<number | undefined, ReviewResponseDTO[]>(
    async ({ args }) => {
      const items = await reviewQueries.recent(args);
      return items.map(mapReviewToResponse);
    }
  ),

  countByTarget: createAction<
    {
      targetType: 'service' | 'article' | 'page';
      targetId?: string;
      pageKey?: string;
    },
    number
  >(async ({ args }) => {
    return reviewQueries.countByTarget(
      args.targetType,
      args.targetId,
      args.pageKey
    );
  }),

  averageRating: createAction<
    {
      targetType: 'service' | 'article' | 'page';
      targetId?: string;
      pageKey?: string;
    },
    { average: number; count: number }
  >(async ({ args }) => {
    return reviewQueries.averageRating(
      args.targetType,
      args.targetId,
      args.pageKey
    );
  }),
};
