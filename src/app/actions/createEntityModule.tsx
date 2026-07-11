import { ValidationError } from '@/app/lib/server/errors';
import { dbConnect } from '@/app/lib/server/mongoose';

type PaginationResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
};

type BaseRepo<TCreate, TUpdate, TEntity, TListItem> = {
  findAll: () => Promise<TListItem[]>;

  findAllPaginated: (
    page: number,
    limit: number
  ) => Promise<PaginationResult<TListItem>>;

  findById: (id: string) => Promise<TEntity | null>;
  create: (data: TCreate) => Promise<TEntity>;
  update: (id: string, data: TUpdate) => Promise<TEntity | null>;
  deleteById: (id: string) => Promise<TEntity | null>;

  existsBySlug?(slug: string): Promise<boolean>;
};

export function createEntityModule<
  TCreateRepo extends Record<string, unknown>,
  TUpdateRepo extends Record<string, unknown>,
  TEntity extends { _id: unknown },
  TListItem,
  TDto = TEntity,
  TListDto = TListItem,
  TCreateInput = TCreateRepo,
>(config: {
  repo: BaseRepo<TCreateRepo, TUpdateRepo, TEntity, TListItem>;

  /** Мапить сутність (getById/getBySlug/create/update) у безпечний DTO */
  toDTO?: (entity: TEntity) => TDto;
  /** Мапить елемент списку (getAll) у безпечний DTO */
  toListDTO?: (item: TListItem) => TListDto;

  slug?:
    | { enabled: false }
    | {
        enabled: true;
        makeSlug: (input: string) => string;
        getBase?: (data: TCreateInput) => string;
      };

  validation?: {
    notFoundMessage?: string;
    slugConflictMessage?: string;
  };
}) {
  const notFound = config.validation?.notFoundMessage ?? 'Entity not found';
  const slugConflict =
    config.validation?.slugConflictMessage ?? 'Slug already exists';
  const isSlugEnabled = config.slug?.enabled === true;

  // за замовчуванням — identity-мапінг, старі виклики без toDTO продовжують працювати як раніше
  const toDTO =
    config.toDTO ?? ((entity: TEntity) => entity as unknown as TDto);
  const toListDTO =
    config.toListDTO ?? ((item: TListItem) => item as unknown as TListDto);

  const resolveSlug = (data: unknown): string => {
    if (!config.slug || config.slug.enabled === false) return '';
    const base =
      config.slug.getBase?.(data as TCreateInput) ??
      (data as Record<string, unknown>)?.title ??
      '';
    return config.slug.makeSlug(String(base));
  };

  const ensureSlugRepo = () => {
    if (isSlugEnabled && !config.repo.existsBySlug) {
      throw new Error(
        'Slug is enabled but repo.existsBySlug is not implemented'
      );
    }
  };

  return {
    getAll: async (args?: { page?: number; limit?: number }) => {
      await dbConnect();

      const page = Math.max(1, args?.page ?? 1);
      const limit = Math.max(1, args?.limit ?? 20);
      const result = await config.repo.findAllPaginated(page, limit);
      return {
        items: result.items.map(toListDTO),
        total: result.total,
        hasMore: result.hasMore,
      };
    },

    getById: async (id: string) => {
      await dbConnect();

      const item = await config.repo.findById(id);
      if (!item) throw new ValidationError(notFound);
      return toDTO(item);
    },

    create: async (data: TCreateInput) => {
      await dbConnect();

      let payload = data as unknown as TCreateRepo;

      if (isSlugEnabled) {
        ensureSlugRepo();
        const slug = resolveSlug(data);
        const exists = await config.repo.existsBySlug!(slug);

        if (exists) {
          throw new ValidationError(slugConflict);
        }
        payload = { ...payload, slug };
      }

      const created = await config.repo.create(payload);
      return toDTO(created);
    },

    update: async (id: string, data: TUpdateRepo) => {
      await dbConnect();

      const existing = await config.repo.findById(id);
      if (!existing) throw new ValidationError(notFound);

      const patch: TUpdateRepo & { slug?: string } = { ...data };

      if (isSlugEnabled) {
        ensureSlugRepo();
        const slug = resolveSlug(patch);
        const conflict = await config.repo.existsBySlug!(slug);
        if (conflict) {
          const current = await config.repo.findById(id);

          if (!current) {
            throw new ValidationError(notFound);
          }

          if ((current as { slug?: string }).slug !== slug) {
            throw new ValidationError(slugConflict);
          }
        }
        patch.slug = slug;
      }

      const updated = await config.repo.update(id, patch);
      if (!updated) throw new ValidationError(notFound);
      return toDTO(updated);
    },

    delete: async (id: string) => {
      await dbConnect();

      const existing = await config.repo.findById(id);
      if (!existing) throw new ValidationError(notFound);
      await config.repo.deleteById(id);
      return { ok: true as const };
    },
  };
}
