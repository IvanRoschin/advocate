import ClientAccess from '@/app/models/ClientAccess';

export const clientAccessRepo = {
  async findPreferredActiveByUserId(userId: string) {
    const accesses = await ClientAccess.find({
      userId,
      isActive: true,
    })
      .sort({ createdAt: 1 })
      .lean();

    if (!accesses.length) {
      return null;
    }

    return (
      accesses.find(access => access.accessRole === 'owner') ?? accesses[0]
    );
  },
};
