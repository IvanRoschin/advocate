import { ClientSession } from 'mongoose';

import type { CreateLeadDTO, UpdateLeadDTO } from '@/app/types';
import { Lead } from '@/models';
import { createQuery } from './queryFactory';
const leadQuery = createQuery(Lead);

export const leadRepo = {
  async findAll() {
    return Lead.find().sort({ createdAt: -1 });
  },

  async findAllPaginated(page: number, limit: number) {
    return leadQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount();
  },

  async findById(id: string) {
    return Lead.findById(id);
  },

  async create(data: CreateLeadDTO) {
    return Lead.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message ?? '',
      source: data.source,
    });
  },

  async update(id: string, data: UpdateLeadDTO) {
    return Lead.findByIdAndUpdate(
      id,
      { ...data },
      { returnDocument: 'after', runValidators: true }
    );
  },

  async deleteById(id: string, session?: ClientSession) {
    return Lead.findByIdAndDelete(id, { session });
  },

  async findEntityById(id: string) {
    return Lead.findById(id);
  },

  async updateRaw(
    id: string,
    data: Record<string, unknown>,
    session?: ClientSession
  ) {
    return Lead.findByIdAndUpdate(id, data, {
      runValidators: true,
      returnDocument: 'after',
      session,
    });
  },
};
