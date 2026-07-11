export type PaginatedResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
};

export interface CrudRepository<TCreate, TDocument, TListItem> {
  findAll(): Promise<TListItem[]>;

  findAllPaginated(
    page: number,
    limit: number
  ): Promise<PaginatedResult<TListItem>>;

  findById(id: string): Promise<TDocument | null>;

  findBySlug(slug: string): Promise<TDocument | null>;

  create(data: TCreate): Promise<TDocument>;

  deleteById(id: string): Promise<TDocument | null>;
}

export type EntityModuleConfig<TCreate, TEntity, TListItem> = {
  repo: {
    findAll: () => Promise<TListItem[]>;
    findAllPaginated: (
      page: number,
      limit: number
    ) => Promise<{
      items: TListItem[];
      total: number;
      hasMore: boolean;
    }>;
    findById: (id: string) => Promise<TEntity | null>;
    findBySlug: (slug: string) => Promise<TEntity | null>;
    create: (data: TCreate) => Promise<TEntity>;
    deleteById: (id: string) => Promise<unknown>;
  };

  slug?: {
    enabled: boolean;
    makeSlug: (input: string) => string;
  };

  validation?: {
    notFoundMessage?: string;
  };
};
