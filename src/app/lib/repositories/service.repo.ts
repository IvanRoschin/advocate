import { Types } from 'mongoose';

import { Category } from '@/app/models';
import Service from '@/app/models/Service';
import type {
  CreateServiceRequestDTO,
  ServiceLayoutNode,
  ServiceLike,
  ServiceSectionsDto,
  ServiceStatus,
} from '@/app/types';
import { createQuery } from './queryFactory';
/* ========================= TYPES ========================= */

export type ServiceListRow = {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  summary: string;
  src?: string[];
};

export type ServicePublicFullRow = {
  _id: Types.ObjectId;

  slug: string;
  status: ServiceStatus;

  title: string;
  summary: string;

  src?: string[];

  layout: ServiceLayoutNode[];
  sections: ServiceSectionsDto;

  seoTitle: string;
  seoDescription: string;

  relatedArticles: Array<Types.ObjectId | unknown>;

  publishedAt?: Date;
  updatedAt?: Date;
};

const PUBLIC_SORT = { publishedAt: -1, _id: -1 } as const;
const serviceQuery = createQuery(Service);

/* ========================= REPO ========================= */

export const serviceRepo = {
  /* ================= CRUD================= */

  async findAll(): Promise<ServiceLike[]> {
    return Service.find()
      .sort({ createdAt: -1 })
      .select('_id slug title summary src')
      .lean<ServiceLike[]>();
  },

  async findAllPaginated(page: number, limit: number) {
    return serviceQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount<ServiceLike>();
  },

  async findById(id: string) {
    return Service.findById(id);
  },

  async findBySlug(slug: string) {
    return Service.findOne({ slug });
  },

  async existsBySlug(slug: string) {
    return (await Service.exists({ slug })) !== null;
  },

  async create(data: CreateServiceRequestDTO) {
    return Service.create(data);
  },

  async update(
    id: string,
    data: Partial<CreateServiceRequestDTO & { slug: string; src: string[] }>
  ) {
    return Service.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    }).lean<ServiceLike>();
  },

  async deleteById(id: string) {
    return Service.findByIdAndDelete(id);
  },
};

/* ================= PUBLIC ================= */

export const serviceQueries = {
  async list(args: { page?: number; limit?: number; categorySlug?: string }) {
    const page = Math.max(1, args?.page ?? 1);
    const limit = Math.max(1, args?.limit ?? 10);

    const categoryId = args?.categorySlug
      ? await resolveCategoryIdBySlug(args.categorySlug)
      : null;

    return serviceQuery()
      .where({
        status: 'published',
        ...(categoryId ? { categoryId } : {}),
      })
      .sortBy(PUBLIC_SORT)
      .paginate(page, limit)
      .execWithCount<ServiceListRow>();
  },

  async findPublicPaginated(page: number, limit: number) {
    return serviceQuery()
      .where({ status: 'published' })
      .sortBy({ publishedAt: -1 })
      .paginate(page, limit)
      .execWithCount<ServiceListRow>();
  },

  async findPublicList(limit = 24): Promise<ServiceListRow[]> {
    return Service.find({ status: 'published' })
      .select('_id slug title summary src')
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .lean<ServiceListRow[]>();
  },

  async findPublishedBySlug(
    slug: string
  ): Promise<ServicePublicFullRow | null> {
    return Service.findOne({ slug, status: 'published' })
      .select(
        'slug status title summary src layout sections seoTitle seoDescription publishedAt updatedAt relatedArticles'
      )
      .populate({ path: 'relatedArticles', select: 'slug title summary src' })
      .lean<ServicePublicFullRow>();
  },
};

async function resolveCategoryIdBySlug(slug: string) {
  const category = await Category.findOne({ slug })
    .select('_id')
    .lean<{ _id: Types.ObjectId }>();

  return category?._id ?? null;
}
