import { revalidatePath } from 'next/cache';
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

const serviceEntityActions = createEntityModule({
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

export const serviceActions = {
  ...serviceEntityActions,
  create: async (...args: Parameters<typeof serviceEntityActions.create>) => {
    const result = await serviceEntityActions.create(...args);
    revalidatePath('/services');
    revalidatePath(`/services/${result.slug}`);
    return result;
  },
  update: async (...args: Parameters<typeof serviceEntityActions.update>) => {
    const result = await serviceEntityActions.update(...args);
    revalidatePath('/services');
    revalidatePath(`/services/${result.slug}`);
    return result;
  },
  delete: async (...args: Parameters<typeof serviceEntityActions.delete>) => {
    const result = await serviceEntityActions.delete(...args);
    revalidatePath('/services');
    return result;
  },
};

export const servicePublicActions = {
  list: createAction<
    {
      page?: number;
      limit?: number;
      categorySlug?: string;
    },
    PublicListResult
  >(
    async ({ args }) => {
      const result = await serviceQueries.list(args);

      return {
        ...result,
        items: result.items.map(mapServiceRowToListItem),
      };
    },
    { buildFallback: { items: [], total: 0, hasMore: false } }
  ),

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
