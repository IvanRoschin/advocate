import type { Session } from 'next-auth';

import { NavItemLink, PUBLIC_NAV_ITEMS } from '@/app/config/nav';
import { routes } from '@/app/config/routes';
import { iconLibrary } from '@/app/resources';

const resolveDashboardHref = (role?: string) => {
  const normalizedRole = typeof role === 'string' ? role.toUpperCase() : '';

  if (normalizedRole === 'ADMIN' || normalizedRole === 'MANAGER') {
    return routes.admin.dashboard;
  }

  if (normalizedRole === 'CLIENT') {
    return routes.client.dashboard;
  }

  return routes.public.auth.signIn;
};

export const getPublicNavItems = (session: Session | null): NavItemLink[] => {
  const items = PUBLIC_NAV_ITEMS.filter(
    item => 'href' in item && item.key !== 'dashboard'
  ) as NavItemLink[];

  if (!session?.user) {
    return [
      ...items,
      {
        key: 'signin',
        href: routes.public.auth.signIn,
        label: 'Увійти',
        Icon: iconLibrary.person,
      },
    ];
  }

  return [
    ...items,
    {
      key: 'dashboard',
      href: resolveDashboardHref(session.user.role),
      label: 'Кабінет',
      Icon: iconLibrary.person,
    },
  ];
};
