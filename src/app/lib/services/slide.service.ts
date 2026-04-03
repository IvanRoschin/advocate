import {
  CreateSlideDTO,
  mapSlideToResponse,
  SlideResponseDTO,
  UpdateSlideDTO,
} from '@/app/types';

import { slideRepo } from '../repositories/slide.repo';

function normalizeSlidePayload<T extends CreateSlideDTO | UpdateSlideDTO>(
  payload: T
): T {
  return {
    ...payload,
    title: payload.title?.trim(),
    desc: payload.desc?.trim(),
    src: payload.src?.filter(Boolean).map(item => item.trim()),
  };
}

export const slideService = {
  async getAll(): Promise<SlideResponseDTO[]> {
    const slides = await slideRepo.findAll();
    return slides.map(mapSlideToResponse);
  },

  async getActiveSlides(): Promise<SlideResponseDTO[]> {
    const slides = await slideRepo.getActiveSlides();
    return slides.map(mapSlideToResponse);
  },

  async getById(id: string): Promise<SlideResponseDTO | null> {
    const slide = await slideRepo.findById(id);
    return slide ? mapSlideToResponse(slide) : null;
  },

  async create(payload: CreateSlideDTO): Promise<SlideResponseDTO> {
    const normalized = normalizeSlidePayload(payload);

    if (!normalized.title) {
      throw new Error('Title is required');
    }

    if (!normalized.desc) {
      throw new Error('Description is required');
    }

    if (!normalized.src || normalized.src.length === 0) {
      throw new Error('At least one image is required');
    }

    if (normalized.isActive) {
      await slideRepo.deactivateAll();
    }

    const created = await slideRepo.create(normalized);
    return mapSlideToResponse(created.toObject());
  },

  async update(
    id: string,
    payload: UpdateSlideDTO
  ): Promise<SlideResponseDTO | null> {
    const normalized = normalizeSlidePayload(payload);

    if (normalized.isActive) {
      const active = await slideRepo.activate(id);
      return active ? mapSlideToResponse(active) : null;
    }

    const updated = await slideRepo.updateById(id, normalized);
    return updated ? mapSlideToResponse(updated) : null;
  },

  async delete(id: string): Promise<boolean> {
    const deleted = await slideRepo.deleteById(id);
    return Boolean(deleted);
  },

  async activate(id: string): Promise<SlideResponseDTO | null> {
    const updated = await slideRepo.activate(id);
    return updated ? mapSlideToResponse(updated) : null;
  },

  async deactivate(id: string): Promise<SlideResponseDTO | null> {
    const updated = await slideRepo.deactivate(id);
    return updated ? mapSlideToResponse(updated) : null;
  },

  async search(query: string): Promise<SlideResponseDTO[]> {
    const slides = await slideRepo.search(query);
    return slides.map(mapSlideToResponse);
  },
};
