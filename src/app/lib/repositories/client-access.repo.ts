import { ClientSession } from 'mongoose';

import ClientAccess from '@/app/models/ClientAccess';

export type ClientAccessRow = {
  _id: import('mongoose').Types.ObjectId;
  userId: import('mongoose').Types.ObjectId;
  clientId: import('mongoose').Types.ObjectId;
  accessRole: 'owner' | 'manager' | 'viewer';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export const clientAccessRepo = {
  async create(
    data: {
      userId: string;
      clientId: string;
      accessRole?: 'owner' | 'manager' | 'viewer';
      isActive?: boolean;
    },
    session?: ClientSession
  ) {
    return ClientAccess.create(
      [
        {
          userId: data.userId,
          clientId: data.clientId,
          accessRole: data.accessRole ?? 'owner',
          isActive: data.isActive ?? true,
        },
      ],
      { session }
    ).then(([doc]) => doc);
  },

  findActiveByUserId(userId: string): Promise<ClientAccessRow | null> {
    return ClientAccess.findOne({
      userId,
      isActive: true,
    }).lean<ClientAccessRow | null>();
  },
};
