import { IconName } from './icons';

export const CATEGORY_ICON_KEYS = [
  'banking',
  'credit',
  'family',
  'military',
  'inheritance',
  'business',
  'civil',
  'criminal',
  'administrative',
  'realEstate',
  'labor',
  'documents',
  'disputes',
  'protection',
] as const satisfies readonly IconName[];

export const DEFAULT_CATEGORY_ICON: CategoryIconKey = 'civil';

export type CategoryIconKey = (typeof CATEGORY_ICON_KEYS)[number];
