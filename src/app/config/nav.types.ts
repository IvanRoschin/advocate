import type { IconType } from 'react-icons';

export type NavScope = 'public' | 'admin' | 'client' | 'manager' | 'mobile';

export type BaseNavItem = {
  key: string;
  label: string;
  Icon: IconType;
  startsWith?: boolean;
  enabled?: boolean;
};

export type NavItemLink = BaseNavItem & {
  href: string;
  onClick?: never;
};

export type NavItemAction = BaseNavItem & {
  href?: never;
  onClick: () => void | Promise<void>;
};

export type NavItem = NavItemLink | NavItemAction;
