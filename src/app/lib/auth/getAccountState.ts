import { UserRole } from '@/types';

export type AccountState =
  | 'guest'
  | 'inactive'
  | 'client_no_access'
  | 'client_ready'
  | 'admin_ready';

export type SessionLike = {
  user?: {
    id?: string | null;
    role?: string | null;
    activeClientId?: string | null;
    isActive?: boolean | null;
  } | null;
} | null;

export function getAccountState(session: SessionLike): AccountState {
  if (!session?.user?.id) {
    return 'guest';
  }

  if (session.user.isActive === false) {
    return 'inactive';
  }

  if (session.user.role === UserRole.CLIENT) {
    return session.user.activeClientId ? 'client_ready' : 'client_no_access';
  }

  if (
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.MANAGER
  ) {
    return 'admin_ready';
  }

  return 'guest';
}
