import { UserRole } from '@/app/types';

export type UserScope = 'admin' | 'manager' | 'client';

export const getUserScope = (role?: string): UserScope => {
  if (role === UserRole.ADMIN) return 'admin';
  if (role === UserRole.MANAGER) return 'manager';
  if (role === UserRole.CLIENT) return 'client';

  return 'manager';
};
