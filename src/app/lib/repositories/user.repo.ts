import { ClientSession } from 'mongoose';

import {
  CreateUserRequestDTO,
  mapUserToResponse,
  UpdateUserDTO,
  UserLean,
  UserResponseDTO,
  UserRole,
} from '@/app/types';
import { User } from '@/models';

import { createQuery } from './queryFactory';

const userQuery = createQuery(User);

/* ========================= TYPES ========================= */

export type RepoPaginatedResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
};

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
      new: true,
    });
  },

  async deleteById(id: string) {
    return User.findByIdAndDelete(id);
  },
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
