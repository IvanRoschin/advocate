import { Client, ClientAccess, User } from '@/app/models';
import type {
  ClientResponseDTO,
  CreateClientDTO,
  UpdateClientDTO,
} from '@/app/types';
import { mapClientToResponse } from '@/app/types';
import { deleteClientCascade } from './client-deletion.helpers';
import { createQuery } from './queryFactory';
export type RepairClientAccessResult =
  | {
      ok: true;
      code: 'ALREADY_LINKED' | 'LINKED';
      clientId: string;
      clientAccessRole: 'owner' | 'manager' | 'viewer';
    }
  | {
      ok: false;
      code:
        | 'USER_NOT_FOUND'
        | 'USER_NOT_CLIENT'
        | 'CLIENT_NOT_FOUND'
        | 'MULTIPLE_CLIENTS_FOUND';
    };

function normalizeEmail(email?: string | null): string {
  return (email ?? '').trim().toLowerCase();
}

function normalizePhone(phone?: string | null): string {
  return (phone ?? '').replace(/\s+/g, '').trim();
}

const clientQuery = createQuery(Client);

export const clientRepo = {
  /* ================= CRUD ================= */

  async findAll(): Promise<ClientResponseDTO[]> {
    const clients = await Client.find().sort({ createdAt: -1 });
    return clients.map(mapClientToResponse);
  },

  async findAllPaginated(page: number, limit: number) {
    const result = await clientQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount<Parameters<typeof mapClientToResponse>[0]>();

    return {
      ...result,
      items: result.items.map(mapClientToResponse),
    };
  },

  async findById(id: string): Promise<ClientResponseDTO | null> {
    const client = await Client.findById(id);
    return client ? mapClientToResponse(client) : null;
  },

  async create(data: CreateClientDTO): Promise<ClientResponseDTO> {
    const [doc] = await Client.create([data]);
    return mapClientToResponse(doc);
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
      { returnDocument: 'after', runValidators: true }
    );

    return client ? mapClientToResponse(client) : null;
  },

  async deleteById(id: string) {
    return deleteClientCascade(id);
  },

  async repairClientAccessService(
    userId: string
  ): Promise<RepairClientAccessResult> {
    const user = await User.findById(userId).lean();

    if (!user) {
      return {
        ok: false,
        code: 'USER_NOT_FOUND',
      };
    }

    if (user.role !== 'client') {
      return {
        ok: false,
        code: 'USER_NOT_CLIENT',
      };
    }

    const existingAccesses = await ClientAccess.find({
      userId: user._id,
      isActive: true,
    })
      .sort({ createdAt: 1 })
      .lean();

    if (existingAccesses.length > 0) {
      const preferredAccess =
        existingAccesses.find(access => access.accessRole === 'owner') ??
        existingAccesses[0];

      return {
        ok: true,
        code: 'ALREADY_LINKED',
        clientId: preferredAccess.clientId.toString(),
        clientAccessRole: preferredAccess.accessRole,
      };
    }

    const normalizedEmail = normalizeEmail(user.email);
    const normalizedPhone = normalizePhone(user.phone);

    const orConditions: Array<Record<string, unknown>> = [];

    if (normalizedEmail) {
      orConditions.push({ email: normalizedEmail });
    }

    if (normalizedPhone) {
      orConditions.push({ phone: normalizedPhone });
    }

    if (orConditions.length === 0) {
      return {
        ok: false,
        code: 'CLIENT_NOT_FOUND',
      };
    }

    const matchedClients = await Client.find({
      $or: orConditions,
    })
      .select('_id email phone')
      .lean();

    if (matchedClients.length === 0) {
      return {
        ok: false,
        code: 'CLIENT_NOT_FOUND',
      };
    }

    if (matchedClients.length > 1) {
      return {
        ok: false,
        code: 'MULTIPLE_CLIENTS_FOUND',
      };
    }

    const client = matchedClients[0];

    try {
      await ClientAccess.create({
        userId: user._id,
        clientId: client._id,
        accessRole: 'owner',
        isActive: true,
      });
    } catch (error: unknown) {
      const maybeMongoError = error as { code?: number };

      if (maybeMongoError?.code === 11000) {
        const createdAccess = await ClientAccess.findOne({
          userId: user._id,
          clientId: client._id,
          isActive: true,
        }).lean();

        if (createdAccess) {
          return {
            ok: true,
            code: 'ALREADY_LINKED',
            clientId: createdAccess.clientId.toString(),
            clientAccessRole: createdAccess.accessRole,
          };
        }
      }
    }
    return {
      ok: false,
      code: 'CLIENT_NOT_FOUND',
    };
  },
};
