import slugify from 'slugify';

import { serviceQueries, serviceRepo } from '../lib/repositories';
import { ValidationError } from '../lib/server/errors';
import {
  mapPublicServiceRowToPage,
  mapServiceRowToListItem,
  mapServiceToResponse,
  ServiceListItemDto,
  ServicePublicPageDto,
} from '../types';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

type PublicListResult = {
  items: ServiceListItemDto[];
  total: number;
  hasMore: boolean;
};

export const serviceActions = createEntityModule({
  repo: serviceRepo,

  toDTO: mapServiceToResponse,
  toListDTO: mapServiceToResponse,

  slug: {
    enabled: true,
    makeSlug: input =>
      slugify(input, { lower: true, strict: true, locale: 'uk' }),
    getBase: data => data.title,
  },

  validation: {
    notFoundMessage: 'Service not found',
    slugConflictMessage: 'Service slug already exists',
  },
});

export const servicePublicActions = {
  list: createAction<
    {
      page?: number;
      limit?: number;
      categorySlug?: string;
    },
    PublicListResult
  >(async ({ args }) => {
    const result = await serviceQueries.list(args);

    return {
      ...result,
      items: result.items.map(mapServiceRowToListItem),
    };
  }),

  findPublishedBySlug: createAction<{ slug: string }, ServicePublicPageDto>(
    async ({ args }) => {
      const service = await serviceQueries.findPublishedBySlug(args.slug);

      if (!service) {
        throw new ValidationError('Service not found');
      }

      return mapPublicServiceRowToPage(service);
    }
  ),
};
