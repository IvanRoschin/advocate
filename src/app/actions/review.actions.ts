import { reviewQueries, reviewRepo } from '../lib/repositories/review.repo';
import { mapReviewToResponse, ReviewResponseDTO } from '../types';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

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

export const reviewPublicActions = {
  list: createAction<
    {
      page?: number;
      limit?: number;
      targetType?: 'service' | 'article' | 'page';
      targetId?: string;
      pageKey?: string;
    },
    PublicListResult
  >(async ({ args }) => {
    const result = await reviewQueries.list(args);

    return {
      ...result,
      items: result.items.map(mapReviewToResponse),
    };
  }),

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
    {
      average: number;
      count: number;
    }
  >(async ({ args }) => {
    return reviewQueries.averageRating(
      args.targetType,
      args.targetId,
      args.pageKey
    );
  }),
};
