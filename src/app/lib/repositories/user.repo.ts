import mongoose, { ClientSession, HydratedDocument } from 'mongoose';

import {
  CreateUserRequestDTO,
  mapUserToResponse,
  UpdateUserDTO,
  UserLean,
  UserResponseDTO,
  UserRole,
} from '@/app/types';
import { Case, Client, ClientAccess, User } from '@/models';
import type { UserDocument } from '@/models/User';
import { createQuery } from './queryFactory';

const userQuery = createQuery(User);

/* ========================= TYPES ========================= */

export type RepoPaginatedResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
};

/**
 * Каскадно видаляє користувача. Якщо користувач був власником
 * (accessRole: 'owner') клієнтського профілю — видаляє також цей Client
 * і всі його справи (Case). Доступи (ClientAccess) видаляються завжди,
 * незалежно від ролі (owner/manager/viewer).
 */
async function deleteUserCascade(
  id: string
): Promise<HydratedDocument<UserDocument> | null> {
  const session = await mongoose.startSession();

  try {
    let deletedUser: HydratedDocument<UserDocument> | null = null;

    await session.withTransaction(async () => {
      const user = await User.findById(id, null, { session });
      if (!user) return;

      const accesses = await ClientAccess.find({ userId: id }, null, {
        session,
      }).lean();

      const ownedClientIds = accesses
        .filter(access => access.accessRole === 'owner')
        .map(access => access.clientId);

      if (ownedClientIds.length) {
        await Case.deleteMany(
          { clientId: { $in: ownedClientIds } },
          { session }
        );
        await ClientAccess.deleteMany(
          { clientId: { $in: ownedClientIds } },
          { session }
        );
        await Client.deleteMany({ _id: { $in: ownedClientIds } }, { session });
      }

      // доступи цього користувача до чужих клієнтів (manager/viewer)
      await ClientAccess.deleteMany({ userId: id }, { session });

      deletedUser = await User.findByIdAndDelete(id, { session });
    });

    return deletedUser;
  } finally {
    await session.endSession();
  }
}

/* ========================= REPO ========================= */

export const userRepo = {
  /* ================= LIST ================= */

  async findAll(): Promise<UserLean[]> {
    return User.find()
      .sort({ createdAt: -1 })
      .select('_id name surname email phone role isActive createdAt updatedAt')
      .lean<UserLean[]>();
  },

  async findAllPaginated(page: number, limit: number) {
    return userQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount<UserLean>();
  },

  /* ================= GET ================= */

  async findById(id: string) {
    return User.findById(id);
  },

  async findByEmail(email: string) {
    return User.findOne({ email });
  },

  async findByPhone(phone: string) {
    return User.findOne({ phone: phone.trim() });
  },

  /* ================= WRITE ================= */

  async create(data: CreateUserRequestDTO, session?: ClientSession) {
    const [doc] = await User.create([data], { session });
    return doc;
  },

  async update(id: string, data: UpdateUserDTO) {
    return User.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
  },

  deleteById: deleteUserCascade,
};

/* ========================= QUERIES ========================= */

export const userQueries = {
  /* ================= ADMINS / MANAGERS ================= */

  async findAdminsAndManagers(): Promise<UserResponseDTO[]> {
    const users = await User.find({
      role: { $in: [UserRole.ADMIN, UserRole.MANAGER] },
    })
      .select('_id name role email isActive')
      .lean();

    return users.map(mapUserToResponse);
  },

  /* ================= ACTIVE USERS ================= */

  async findActive(): Promise<UserResponseDTO[]> {
    const users = await User.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return users.map(mapUserToResponse);
  },

  /* ================= RECENT ================= */

  async recent(limit = 10): Promise<UserResponseDTO[]> {
    const users = await User.find().sort({ createdAt: -1 }).limit(limit).lean();

    return users.map(mapUserToResponse);
  },

  /* ================= STATS ================= */

  async countByRole() {
    return User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);
  },
};
