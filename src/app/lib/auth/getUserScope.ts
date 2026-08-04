// Direct path, not the `@/app/types` barrel — this runs client-side (called
// from NavPill/NavDesktopList) on every page, and the barrel's `export *`
// drags in every domain's runtime code (see user.store.ts for the details).
import { UserRole } from '@/app/types/user/user.enums';

import type { NavScope } from '@/app/config/nav';

export type UserScope = NavScope;

export const getUserScope = (role?: string): UserScope => {
  if (role === UserRole.ADMIN) return 'admin';
  if (role === UserRole.MANAGER) return 'manager';
  if (role === UserRole.CLIENT) return 'client';

  return 'public';
};
