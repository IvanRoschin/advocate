import type { Model, PopulateOptions, SortOrder } from 'mongoose';

type Sort = Record<string, SortOrder>;
type SelectFields = string | Record<string, 0 | 1>;

type QueryFilter<T> = Partial<Record<keyof T, unknown>>;

export class QueryBuilder<TDoc extends object> {
  private conditions: QueryFilter<TDoc> = {};

  private sort?: Sort;
  private skipValue?: number;
  private limitValue?: number;
  private populates: PopulateOptions[] = [];
  private selectFields?: SelectFields;

  constructor(private model: Model<TDoc>) {}

  where(filter: QueryFilter<TDoc>): this {
    this.conditions = {
      ...this.conditions,
      ...filter,
    };

    return this;
  }

  byId(id: string): this {
    this.conditions = {
      ...this.conditions,
      _id: id,
    };

    return this;
  }

  bySlug(slug: string): this {
    this.conditions = {
      ...this.conditions,
      slug,
    };

    return this;
  }

  sortBy(sort: Sort): this {
    this.sort = sort;
    return this;
  }

  paginate(page = 1, limit = 20): this {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    this.skipValue = (safePage - 1) * safeLimit;
    this.limitValue = safeLimit;

    return this;
  }

  skip(skip: number): this {
    this.skipValue = skip;
    return this;
  }

  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }

  select(fields: SelectFields): this {
    this.selectFields = fields;
    return this;
  }

  populate(populate: PopulateOptions | PopulateOptions[]): this {
    const items = Array.isArray(populate) ? populate : [populate];
    this.populates.push(...items);
    return this;
  }

  async exec<TResult = TDoc>(): Promise<TResult[]> {
    let query = this.model.find(this.conditions);

    if (this.selectFields) query = query.select(this.selectFields);
    if (this.sort) query = query.sort(this.sort);
    if (this.skipValue !== undefined) query = query.skip(this.skipValue);
    if (this.limitValue !== undefined) query = query.limit(this.limitValue);

    for (const p of this.populates) {
      query = query.populate(p) as typeof query;
    }

    return query.lean<TResult[]>();
  }

  async execWithCount<TResult = TDoc>() {
    const [items, total] = await Promise.all([
      this.exec<TResult>(),
      this.model.countDocuments(this.conditions),
    ]);

    const hasMore =
      this.skipValue !== undefined && this.limitValue !== undefined
        ? this.skipValue + items.length < total
        : false;

    return { items, total, hasMore };
  }
}
