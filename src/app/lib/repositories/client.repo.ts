import { Client } from '@/app/models';
import {
  ClientResponseDTO,
  CreateClientDTO,
  mapClientToResponse,
  UpdateClientDTO,
} from '@/app/types';

export const clientRepository = {
  async findAll(): Promise<ClientResponseDTO[]> {
    const clients = await Client.find().sort({ createdAt: -1 });
    return clients.map(mapClientToResponse);
  },

  async findById(id: string): Promise<ClientResponseDTO | null> {
    const client = await Client.findById(id);

    return client ? mapClientToResponse(client) : null;
  },

  async create(data: CreateClientDTO): Promise<ClientResponseDTO> {
    const client = await Client.create({
      type: data.type,
      status: data.status ?? 'active',
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName ?? '',
      taxId: data.taxId ?? '',
      address: data.address ?? '',
      notes: data.notes ?? '',
      sourceLeadId: data.sourceLeadId ?? null,
    });

    return mapClientToResponse(client);
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
