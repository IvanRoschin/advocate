import { Types } from 'mongoose';
import slugify from 'slugify';

import { serviceRepo } from '@/app/lib/repositories/service.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import {
  CreateServiceRequestDTO,
  mapPublicServiceRowToPage,
  mapServiceRowToListItem,
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

    return mapPublicServiceRowToPage(row);
  },

  async getPublicList(limit = 30): Promise<ServiceListItemDto[]> {
    await dbConnect();

    const rows = await serviceRepo.findPublicList(limit);
    return rows.map(mapServiceRowToListItem);
  },

  async getAll() {
    await dbConnect();
    return serviceRepo.findAll();
  },

  async getById(id: string) {
    await dbConnect();
    assertObjectId(id);

    const service = await serviceRepo.findById(id);
    if (!service) throw new ValidationError('Послугу не знайдено');

    return service;
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

    const nextSrc =
      data.src === null ? [] : Array.isArray(data.src) ? data.src : undefined;

    Object.assign(service, {
      ...data,
      ...(nextSrc !== undefined ? { src: nextSrc } : {}),
      slug: nextSlug,
    });

    if (data.status === 'published' && !service.publishedAt) {
      service.publishedAt = new Date();
    }

    if (data.status === 'draft') {
      service.publishedAt = undefined;
    }

    await service.save();
    return service;
  },

  async delete(id: string) {
    await dbConnect();
    assertObjectId(id);

    const deleted = await serviceRepo.deleteById(id);
    if (!deleted) throw new ValidationError('Послугу не знайдено');

    return { ok: true };
  },
};
