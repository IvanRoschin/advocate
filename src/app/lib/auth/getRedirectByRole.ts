import { UserRole } from '@/types';

export const isBackofficeRole = (role?: string) =>
  role === UserRole.ADMIN || role === UserRole.MANAGER;

export const getRedirectByRole = (role?: string) =>
  isBackofficeRole(role) ? '/admin' : '/';
