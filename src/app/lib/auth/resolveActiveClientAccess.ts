import ClientAccess from '@/models/ClientAccess';

export type ResolvedActiveClientAccess = {
  activeClientId?: string;
  clientAccessRole?: 'owner' | 'manager' | 'viewer';
};

export async function resolveActiveClientAccess(
  userId: string
): Promise<ResolvedActiveClientAccess> {
  const accesses = await ClientAccess.find({
    userId,
    isActive: true,
  })
    .sort({ createdAt: 1 })
    .lean();

  if (!accesses.length) {
    return {};
  }

  const ownerAccess =
    accesses.find(access => access.accessRole === 'owner') ?? accesses[0];

  return {
    activeClientId: ownerAccess.clientId.toString(),
    clientAccessRole: ownerAccess.accessRole,
  };
}
