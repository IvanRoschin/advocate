import { routes } from '@/app/config/routes';
import { AccountState } from './getAccountState';

export function getRedirectByAccountState(state: AccountState) {
  switch (state) {
    case 'guest':
      return routes.public.auth.signIn;

    case 'inactive':
      return routes.public.auth.verifyEmail;

    case 'client_ready':
      return routes.client.dashboard;

    case 'admin_ready':
      return routes.admin.dashboard;

    default:
      return routes.public.home;
  }
}
