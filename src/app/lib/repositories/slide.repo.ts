import Slide from '@/app/models/Slide';

import type { CreateSlideDTO, UpdateSlideDTO } from '@/app/types';

export const slideRepo = {
  async findAll() {
    return Slide.find().sort({ createdAt: -1 }).lean();
  },

  async findById(id: string) {
    return Slide.findById(id).lean();
  },

  async getActiveSlides() {
    return Slide.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  },

  async create(payload: CreateSlideDTO) {
    return Slide.create(payload);
  },

  async updateById(id: string, payload: UpdateSlideDTO) {
    return Slide.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
  },

  async deleteById(id: string) {
    return Slide.findByIdAndDelete(id).lean();
  },

  async deactivateAll() {
    return Slide.updateMany({}, { $set: { isActive: false } });
  },

  async activate(id: string) {
    return Slide.findByIdAndUpdate(
      id,
      { $set: { isActive: true } },
      { new: true, runValidators: true }
    ).lean();
  },

  async deactivate(id: string) {
    return Slide.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true, runValidators: true }
    ).lean();
  },

  async search(query: string) {
    return Slide.find({ $text: { $search: query } })
      .sort({ createdAt: -1 })
      .lean();
  },
};
