import { revalidatePath } from 'next/cache';
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

const categoryEntityActions = createEntityModule({
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

// Category names/filters surface on both /blog and /services, and there's
// no dedicated category detail page, so revalidate both list routes.
const revalidateCategoryPages = () => {
  revalidatePath('/blog');
  revalidatePath('/services');
};

export const categoryActions = {
  ...categoryEntityActions,
  create: async (...args: Parameters<typeof categoryEntityActions.create>) => {
    const result = await categoryEntityActions.create(...args);
    revalidateCategoryPages();
    return result;
  },
  update: async (...args: Parameters<typeof categoryEntityActions.update>) => {
    const result = await categoryEntityActions.update(...args);
    revalidateCategoryPages();
    return result;
  },
  delete: async (...args: Parameters<typeof categoryEntityActions.delete>) => {
    const result = await categoryEntityActions.delete(...args);
    revalidateCategoryPages();
    return result;
  },
};

/* =========================================================
   PUBLIC
   ========================================================= */

export const categoryPublicActions = {
  /* ================= LIST ================= */

  list: createAction<{ limit?: number } | void, CategoryPublicRow[]>(
    async ({ args }) => {
      const raw = await categoryQueries.list(args?.limit);
      return raw.map(mapCategoryToResponse);
    },
    { buildFallback: [] }
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
