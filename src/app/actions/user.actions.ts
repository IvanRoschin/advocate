import { mapUserToResponse, UserResponseDTO } from '@/app/types';

import { userQueries, userRepo } from '../lib/repositories/user.repo';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

export const userActions = createEntityModule({
  repo: userRepo,
  toDTO: mapUserToResponse,
  toListDTO: mapUserToResponse,

  slug: {
    enabled: false,
  },

  validation: {
    notFoundMessage: 'User not found',
  },
});

type PaginatedUsers = {
  items: UserResponseDTO[];
  total: number;
  hasMore: boolean;
};

export const userPublicActions = {
  /* ================= LIST ================= */

  list: createAction<{ page?: number; limit?: number }, PaginatedUsers>(
    async ({ args }) => {
      const page = Math.max(1, args?.page ?? 1);
      const limit = Math.max(1, args?.limit ?? 10);

      const result = await userRepo.findAllPaginated(page, limit);

      return {
        ...result,
        items: result.items.map(mapUserToResponse),
      };
    }
  ),

  /* ================= ADMINS / MANAGERS ================= */

  adminsAndManagers: createAction<void, UserResponseDTO[]>(async () => {
    const items = await userQueries.findAdminsAndManagers();
    return items;
  }),

  /* ================= ACTIVE USERS ================= */

  active: createAction<void, UserResponseDTO[]>(async () => {
    const items = await userQueries.findActive();
    return items;
  }),

  /* ================= RECENT USERS ================= */

  recent: createAction<number | undefined, UserResponseDTO[]>(
    async ({ args }) => {
      return userQueries.recent(args);
    }
  ),

  /* ================= STATS ================= */

  countByRole: createAction<void, unknown>(async () => {
    return userQueries.countByRole();
  }),
};
