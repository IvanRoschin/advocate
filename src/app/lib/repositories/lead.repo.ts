import { ClientSession } from 'mongoose';

import { Lead } from '@/models';
import { mapLeadToResponse } from '@/app/types';
import type {
  CreateLeadDTO,
  LeadResponseDTO,
  UpdateLeadDTO,
} from '@/app/types';
export const leadRepository = {
  async findAll(): Promise<LeadResponseDTO[]> {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return leads.map(mapLeadToResponse);
  },

  async findById(id: string): Promise<LeadResponseDTO | null> {
    const lead = await Lead.findById(id);
    return lead ? mapLeadToResponse(lead) : null;
  },

  async create(data: CreateLeadDTO): Promise<LeadResponseDTO> {
    const lead = await Lead.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message ?? '',
      source: data.source,
    });

    return mapLeadToResponse(lead);
  },

  async update(
    id: string,
    data: UpdateLeadDTO
  ): Promise<LeadResponseDTO | null> {
    const lead = await Lead.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return lead ? mapLeadToResponse(lead) : null;
  },

  async delete(
    id: string,
    session?: ClientSession
  ): Promise<LeadResponseDTO | null> {
    const lead = await Lead.findByIdAndDelete(id, { session });
    return lead ? mapLeadToResponse(lead) : null;
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
      new: true,
      session,
    });
  },
};
