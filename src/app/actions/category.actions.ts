import slugify from 'slugify';

import {
  categoryQueries,
  categoryRepo,
} from '../lib/repositories/category.repo';
import {
  CategoryPublicRow,
  CategoryResponseDTO,
  mapCategoryToResponse,
} from '../types/category';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

/* =========================================================
   ADMIN CRUD (createEntityModule)
   ========================================================= */

export const categoryActions = createEntityModule({
  repo: categoryRepo,

  toDTO: mapCategoryToResponse,
  toListDTO: mapCategoryToResponse,

  slug: {
    enabled: true,
    makeSlug: input =>
      slugify(input, { lower: true, strict: true, locale: 'uk' }),
    getBase: data => data.title,
  },

  validation: {
    notFoundMessage: 'Категорію не знайдено',
  },
});

/* =========================================================
   PUBLIC
   ========================================================= */

export const categoryPublicActions = {
  /* ================= LIST ================= */

  list: createAction<{ limit?: number } | void, CategoryPublicRow[]>(
    async ({ args }) => {
      const raw = await categoryQueries.list(args?.limit);
      return raw.map(mapCategoryToResponse);
    }
  ),

  /* ================= BY SLUG ================= */

  bySlug: createAction<string, CategoryResponseDTO | null>(
    async ({ args: slug }) => {
      const category = await categoryRepo.findBySlug(slug);
      if (!category) return null;
      return mapCategoryToResponse(category);
    }
  ),
};
