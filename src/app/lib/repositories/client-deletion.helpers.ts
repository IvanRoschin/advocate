import mongoose from 'mongoose';

import { Case, Client, ClientAccess } from '@/app/models';

/**
 * Каскадно видаляє клієнта разом з його справами (Case) та доступами
 * (ClientAccess) в одній транзакції.
 */
export async function deleteClientCascade(id: string): Promise<string | null> {
  const session = await mongoose.startSession();

  try {
    let deletedId: string | null = null;

    await session.withTransaction(async () => {
      const client = await Client.findById(id).session(session);
      if (!client) return;

      await Case.deleteMany({ clientId: id }).session(session);
      await ClientAccess.deleteMany({ clientId: id }).session(session);
      await Client.findByIdAndDelete(id).session(session);

      deletedId = client._id.toString();
    });

    return deletedId;
  } finally {
    await session.endSession();
  }
}
