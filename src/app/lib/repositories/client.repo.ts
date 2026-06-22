import 'server-only';

import { Client } from '@/app/models';
import {
  ClientResponseDTO,
  CreateClientDTO,
  mapClientToResponse,
  UpdateClientDTO,
} from '@/app/types';

/*                                READ OPERATIONS                             */
/* -------------------------------------------------------------------------- */

export async function findAllClients(): Promise<ClientResponseDTO[]> {
  const clients = await Client.find().sort({ createdAt: -1 });
  return clients.map(mapClientToResponse);
}

export async function findClientById(
  id: string
): Promise<ClientResponseDTO | null> {
  const client = await Client.findById(id);
  return client ? mapClientToResponse(client) : null;
}

/* -------------------------------------------------------------------------- */
/*                               WRITE OPERATIONS                             */
/* -------------------------------------------------------------------------- */

export async function createClient(
  data: CreateClientDTO
): Promise<ClientResponseDTO> {
  const [doc] = await Client.create([data]);
  return mapClientToResponse(doc);
}

export async function updateClient(
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
}

export async function deleteClient(id: string) {
  const deleted = await Client.findByIdAndDelete(id);
  return deleted ? deleted._id.toString() : null;
}
