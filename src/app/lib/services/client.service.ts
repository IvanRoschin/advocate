import { Types } from 'mongoose';
import { ValidationError } from 'yup';

import { clientRepository } from '@/app/lib/repositories/client.repo';
import {
  ClientResponseDTO,
  CreateClientDTO,
  mapClientToResponse,
  normalizeClientData,
  UpdateClientDTO,
} from '@/app/types';
import { dbConnect } from '../server/mongoose';

const assertObjectId = (id: string) => {
  if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
    throw new ValidationError('Невірний id клієнта');
  }
};

export const clientService = {
  async getAll(): Promise<ClientResponseDTO[]> {
    await dbConnect();
    return clientRepository.findAll();
  },

  async getById(id: string): Promise<ClientResponseDTO | null> {
    await dbConnect();
    return clientRepository.findById(id);
  },

  async create(payload: CreateClientDTO): Promise<ClientResponseDTO> {
    await dbConnect();

    const data = normalizeClientData(payload);
    return clientRepository.create(data);
  },

  async update(
    id: string,
    payload: UpdateClientDTO
  ): Promise<ClientResponseDTO | null> {
    await dbConnect();
    return clientRepository.update(id, payload);
  },

  async delete(id: string): Promise<ClientResponseDTO> {
    await dbConnect();
    assertObjectId(id);

    const deleted = await clientRepository.delete(id);
    if (!deleted) {
      throw new ValidationError('Клієнта не знайдено');
    }

    return mapClientToResponse(deleted);
  },
};
