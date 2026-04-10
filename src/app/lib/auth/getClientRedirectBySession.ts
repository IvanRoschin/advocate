import { routes } from '@/app/config/routes';
import { UserRole } from '@/types';

type ClientSessionLike = {
  user?: {
    id?: string | null;
    role?: string | null;
    activeClientId?: string | null;
    isActive?: boolean | null;
  } | null;
} | null;

export function getClientRedirectBySession(session: ClientSessionLike): string {
  if (!session?.user?.id) {
    return routes.public.auth.signIn;
  }

  if (session.user.isActive === false) {
    return routes.public.auth.verifyEmail;
  }

  if (
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.MANAGER
  ) {
    return routes.admin.dashboard;
  }

  if (session.user.role === UserRole.CLIENT) {
    return session.user.activeClientId
      ? routes.client.dashboard
      : routes.client.settings.repairClientAccess;
  }

  return routes.public.home;
}
