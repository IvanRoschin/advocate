import { UserRole } from '@/app/types';

export type UserScope = 'admin' | 'manager';

export const getUserScope = (role?: string): UserScope => {
  if (role === UserRole.ADMIN) return 'admin';
  if (role === UserRole.MANAGER) return 'manager';

  return 'manager';
};
