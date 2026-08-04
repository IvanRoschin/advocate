// Type-only re-export for existing consumers (`import type { NavScope } from
// '@/app/config/nav'`). Zero runtime cost — the actual nav item data lives in
// nav.public.ts (always loaded) and nav.private.ts (dynamically imported by
// nav.shared.ts only for admin/client/manager scopes), split out so the
// public bundle never has to include admin/client nav data, icons, or
// next-auth's signOut just because this module used to define everything
// (including the dynamic NAV_ITEMS_BY_SCOPE[scope] lookup) in one place.
export type {
  BaseNavItem,
  NavItem,
  NavItemAction,
  NavItemLink,
  NavScope,
} from './nav.types';
