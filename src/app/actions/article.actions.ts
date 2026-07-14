import { articleQueries, articleRepo } from '../lib/repositories';
import {
  ArticleListItemDto,
  ArticlePublicPageDto,
  BlogCategoryItemDto,
  BlogRecentPostItemDto,
  mapArticleToResponse,
  mapPublicFullRowToPage,
  mapPublicRowToListItem,
  mapRecentRowToBlogItem,
} from '../types';
import { mapCategoryCountToBlogItem } from '../types/category/category.mapper';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

export type PublicListResult = {
  items: ArticleListItemDto[];
  total: number;
  hasMore: boolean;
};

export const articleActions = createEntityModule({
  repo: articleRepo,

  toDTO: mapArticleToResponse,
  toListDTO: mapArticleToResponse,

  slug: {
    enabled: false,
  },

  validation: {
    notFoundMessage: 'Article not found',
    slugConflictMessage: 'Article slug already exists',
  },
});

export const articlePublicActions = {
  list: createAction<
    {
      page?: number;
      limit?: number;
      categorySlug?: string;
    },
    PublicListResult
  >(
    async ({ args }) => {
      const result = await articleQueries.list(args);

      return {
        ...result,
        items: result.items.map(mapPublicRowToListItem),
      };
    },
    { buildFallback: { items: [], total: 0, hasMore: false } }
  ),

  recent: createAction<number | undefined, BlogRecentPostItemDto[]>(
    async ({ args }) => {
      const raw = await articleQueries.recent(args);
      return raw.map(mapRecentRowToBlogItem);
    }
  ),

  related: createAction<
    { categoryId: string; excludeSlug: string; limit?: number },
    ArticleListItemDto[]
  >(async ({ args }) => {
    const raw = await articleQueries.related(args);
    return raw.map(mapPublicRowToListItem);
  }),

  categories: createAction<void, BlogCategoryItemDto[]>(async () => {
    const raw = await articleQueries.categories();
    return raw.map(mapCategoryCountToBlogItem);
  }),

  findBySlug: createAction<string, ArticlePublicPageDto | null>(
    async ({ args: slug }) => {
      const article = await articleRepo.findBySlug(slug);
      if (!article) return null;
      return mapPublicFullRowToPage(article);
    }
  ),
};
