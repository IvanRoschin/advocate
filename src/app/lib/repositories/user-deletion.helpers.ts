import mongoose, { HydratedDocument } from 'mongoose';

import { Case, Client, ClientAccess, User } from '@/models';
import type { UserDocument } from '@/models/User';

/**
 * Каскадно видаляє користувача. Якщо користувач був власником
 * (accessRole: 'owner') клієнтського профілю — видаляє також цей Client
 * і всі його справи (Case). Доступи (ClientAccess) видаляються завжди,
 * незалежно від ролі (owner/manager/viewer).
 */
export async function deleteUserCascade(
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
