import { Types } from 'mongoose';
import slugify from 'slugify';

import { serviceRepo } from '@/app/lib/repositories/service.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { Article } from '@/app/models';
import {
  CreateServiceRequestDTO,
  mapPublicServiceRowToPage,
  mapServiceRowToListItem,
  mapServiceToResponse,
  ServiceListItemDto,
  ServicePublicPageDto,
  UpdateServiceDTO,
} from '@/app/types';
import { dbConnect } from '../server/mongoose';

const makeSlug = (input: string) =>
  slugify(input, { lower: true, strict: true, locale: 'uk', trim: true });

const assertObjectId = (id: string) => {
  if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
    throw new ValidationError('Невірний id послуги');
  }
};

const assertSlug = (slug: string) => {
  const clean = String(slug ?? '')
    .trim()
    .toLowerCase();

  if (!clean || clean === 'undefined') {
    throw new ValidationError('Невірний slug послуги');
  }

  return clean;
};

export const serviceService = {
  async getPublicBySlug(slug: string): Promise<ServicePublicPageDto> {
    await dbConnect();

    const clean = assertSlug(slug);
    const row = await serviceRepo.findPublishedBySlug(clean);

    if (!row) throw new ValidationError('Послугу не знайдено');

    const dto = mapPublicServiceRowToPage(row);

    return dto;
  },

  async getPublicList(args?: {
    limit?: number;
  }): Promise<ServiceListItemDto[]> {
    await dbConnect();

    const limit = args?.limit ?? 30;

    const rows = await serviceRepo.findPublicList(limit);
    return rows.map(mapServiceRowToListItem);
  },

  async getAll() {
    await dbConnect();
    return serviceRepo.findAll().lean();
  },

  async getById(id: string) {
    await dbConnect();
    assertObjectId(id);

    const service = await serviceRepo.findById(id).lean();
    if (!service) throw new ValidationError('Послугу не знайдено');

    return mapServiceToResponse(service);
  },

  async create(data: CreateServiceRequestDTO) {
    await dbConnect();

    const base = data.slug?.trim() ? data.slug : data.title;
    const slug = makeSlug(base);

    const existing = await serviceRepo.findBySlug(slug);
    if (existing) throw new ValidationError('Послуга з таким slug вже існує');

    const src = Array.isArray(data.src) ? data.src : [];

    return serviceRepo.create({ ...data, slug, src });
  },

  async update(id: string, data: UpdateServiceDTO) {
    await dbConnect();
    assertObjectId(id);

    const service = await serviceRepo.findById(id);
    if (!service) throw new ValidationError('Послугу не знайдено');

    const nextTitle =
      typeof data.title === 'string' ? data.title : String(service.title);

    const nextSlugBase =
      typeof data.slug === 'string' && data.slug.trim() ? data.slug : nextTitle;

    const nextSlug = makeSlug(nextSlugBase);

    const exists = await serviceRepo.findBySlug(nextSlug);
    if (exists && exists._id.toString() !== service._id.toString()) {
      throw new ValidationError('Послуга з таким slug вже існує');
    }

    if (data.title !== undefined) {
      service.title = data.title;
    }

    if (data.summary !== undefined) {
      service.summary = data.summary;
    }

    if (data.status !== undefined) {
      service.status = data.status;
    }

    if (data.src !== undefined) {
      service.src = data.src === null ? [] : data.src;
    }

    if (data.layout !== undefined) {
      service.layout = data.layout;
    }

    if (data.sections !== undefined) {
      service.sections = data.sections;
    }

    if (data.seoTitle !== undefined) {
      service.seoTitle = data.seoTitle;
    }

    if (data.seoDescription !== undefined) {
      service.seoDescription = data.seoDescription;
    }

    service.slug = nextSlug;

    if (data.status === 'published' && !service.publishedAt) {
      service.publishedAt = new Date();
    }

    if (data.status === 'draft') {
      service.publishedAt = undefined;
    }

    await service.save();
    return mapServiceToResponse(service.toObject());
  },

  async delete(id: string) {
    await dbConnect();
    assertObjectId(id);

    const service = await serviceRepo.findById(id);
    if (!service) {
      throw new ValidationError('Послугу не знайдено');
    }

    await Article.deleteMany({ serviceId: service._id });

    await serviceRepo.deleteById(id);

    return { ok: true };
  },
};
