import { UserRole } from '@/app/types';

import type { NavScope } from '@/app/config/nav';

export type UserScope = NavScope;

export const getUserScope = (role?: string): UserScope => {
  if (role === UserRole.ADMIN) return 'admin';
  if (role === UserRole.MANAGER) return 'manager';
  if (role === UserRole.CLIENT) return 'client';

  return 'public';
};
