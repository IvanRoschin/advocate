import { ClientSession } from 'mongoose';

import { Client } from '@/app/models';
import {
  ClientResponseDTO,
  CreateClientDTO,
  mapClientToResponse,
  UpdateClientDTO,
} from '@/app/types';

export type ClientRow = {
  _id: import('mongoose').Types.ObjectId;
  type: 'individual' | 'company';
  status: 'active' | 'inactive';
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  taxId: string;
  address: string;
  notes: string;
  sourceLeadId?: import('mongoose').Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export const clientRepo = {
  async findAll(): Promise<ClientResponseDTO[]> {
    const clients = await Client.find().sort({ createdAt: -1 });
    return clients.map(mapClientToResponse);
  },

  async findById(id: string): Promise<ClientResponseDTO | null> {
    const client = await Client.findById(id);

    return client ? mapClientToResponse(client) : null;
  },

  async create(
    data: CreateClientDTO,
    session?: ClientSession
  ): Promise<ClientResponseDTO> {
    return Client.create([data], { session }).then(([doc]) => doc);
  },

  async update(
    id: string,
    data: UpdateClientDTO
  ): Promise<ClientResponseDTO | null> {
    const client = await Client.findByIdAndUpdate(
      id,
      {
        $set: {
          ...data,
          ...(data.email ? { email: data.email.toLowerCase().trim() } : {}),
        },
      },
      { new: true }
    );

    return client ? mapClientToResponse(client) : null;
  },

  delete(id: string) {
    return Client.findByIdAndDelete(id).lean();
  },
};
