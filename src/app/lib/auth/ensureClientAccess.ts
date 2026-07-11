import { Types } from 'mongoose';

import Client from '@/models/Client';
import ClientAccess from '@/models/ClientAccess';

type ClientProvisioningUser = {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  phone?: string | null;
};

export async function ensureUserClient(user: ClientProvisioningUser) {
  const hasAccess = await ClientAccess.exists({
    userId: user._id,
    accessRole: 'owner',
  });

  if (hasAccess) {
    return;
  }

  const client = await Client.create({
    type: 'individual',
    fullName: user.name,
    email: user.email,
    phone: user.phone ?? '',
  });

  await ClientAccess.create({
    userId: user._id,
    clientId: client._id,
    accessRole: 'owner',
  });
}
