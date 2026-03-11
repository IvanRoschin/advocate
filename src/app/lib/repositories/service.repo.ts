import Service from '@/app/models/Service';
import type {
  CreateServiceRequestDTO,
  ServiceLayoutNode,
  ServiceSectionsDto,
  ServiceStatus,
} from '@/app/types';

export type ServiceListRow = {
  _id: import('mongoose').Types.ObjectId;
  slug: string;
  title: string;
  summary: string;
  src?: string[];
};

export type ServicePublicFullRow = {
  _id: import('mongoose').Types.ObjectId;
  slug: string;
  status: ServiceStatus;
  title: string;
  summary: string;
  src?: string[];
  layout: ServiceLayoutNode[];
  sections: ServiceSectionsDto;
  seoTitle: string;
  seoDescription: string;
  publishedAt?: Date;
  updatedAt?: Date;
};

export const serviceRepo = {
  findAll() {
    return Service.find().sort({ createdAt: -1 }).lean();
  },

  findById(id: string) {
    return Service.findById(id);
  },

  findBySlug(slug: string) {
    return Service.findOne({ slug });
  },

  findPublicList(limit = 24): Promise<ServiceListRow[]> {
    return Service.find({ status: 'published' })
      .select('_id slug title summary src')
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .lean<ServiceListRow[]>();
  },

  findPublishedBySlug(slug: string): Promise<ServicePublicFullRow | null> {
    return Service.findOne({ slug, status: 'published' })
      .select(
        'slug status title summary src layout sections seoTitle seoDescription publishedAt updatedAt'
      )
      .lean<ServicePublicFullRow>();
  },

  create(data: CreateServiceRequestDTO & { slug: string; src: string[] }) {
    return Service.create(data);
  },

  deleteById(id: string) {
    return Service.findByIdAndDelete(id);
  },
};
