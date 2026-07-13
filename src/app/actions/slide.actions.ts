import { slideQueries, slideRepo } from '../lib/repositories/slide.repo';
import { mapSlideToResponse, SlideResponseDTO } from '../types';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

export const slideActions = createEntityModule({
  repo: slideRepo,

  toDTO: mapSlideToResponse,
  toListDTO: mapSlideToResponse,

  slug: {
    enabled: false,
  },

  validation: {
    notFoundMessage: 'Slide not found',
  },
});

export const slidePublicActions = {
  list: createAction<
    { page?: number; limit?: number },
    {
      items: ReturnType<typeof mapSlideToResponse>[];
      total: number;
      hasMore: boolean;
    }
  >(async ({ args }) => {
    const page = Math.max(1, args?.page ?? 1);
    const limit = Math.max(1, args?.limit ?? 10);

    const result = await slideRepo.findAllPaginated(page, limit);

    return {
      ...result,
      items: result.items.map(mapSlideToResponse),
    };
  }),

  activate: createAction<string, SlideResponseDTO>(async ({ args: id }) => {
    const slide = await slideRepo.activate(id);

    if (!slide) {
      throw new Error('Slide not found');
    }

    return mapSlideToResponse(slide);
  }),

  deactivate: createAction<string, SlideResponseDTO>(async ({ args: id }) => {
    const slide = await slideRepo.deactivate(id);

    if (!slide) {
      throw new Error('Slide not found');
    }

    return mapSlideToResponse(slide);
  }),

  active: createAction<void, SlideResponseDTO[]>(async () => {
    const items = await slideQueries.findActive();

    return items.map(mapSlideToResponse);
  }),
};
