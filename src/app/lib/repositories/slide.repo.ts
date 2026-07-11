import { Slide } from '@/app/models';
import type { CreateSlideDTO, SlideLike, UpdateSlideDTO } from '@/app/types';
import 'server-only';
import { createQuery } from './queryFactory';
const slideQuery = createQuery(Slide);

export const slideRepo = {
  /* ================= CRUD ================= */

  async findAll(): Promise<SlideLike[]> {
    return Slide.find().lean<SlideLike[]>();
  },

  async findAllPaginated(page: number, limit: number) {
    return slideQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount<SlideLike>();
  },

  async findById(id: string) {
    return Slide.findById(id);
  },

  async create(data: CreateSlideDTO) {
    return Slide.create(data);
  },

  async update(id: string, data: UpdateSlideDTO) {
    return Slide.findByIdAndUpdate(id, data, {
      new: true,
    });
  },

  async deleteById(id: string) {
    return Slide.findByIdAndDelete(id);
  },

  /* ================= Activation ================= */

  async activate(id: string) {
    return Slide.findByIdAndUpdate(id, { isActive: true }, { new: true });
  },

  async deactivate(id: string) {
    return Slide.findByIdAndUpdate(id, { isActive: false }, { new: true });
  },
};

export const slideQueries = {
  async findActive() {
    return Slide.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean<SlideLike[]>();
  },
};
