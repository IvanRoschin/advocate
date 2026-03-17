import type { IconName } from '@/app/resources/icons';

export type AdminStatColor =
  | 'bg-teal-500'
  | 'bg-blue-500'
  | 'bg-green-500'
  | 'bg-indigo-500'
  | 'bg-yellow-500'
  | 'bg-purple-500'
  | 'bg-pink-500';

export interface AdminDashboardStat {
  title: string;
  value: string;
  icon: IconName;
  color: AdminStatColor;
  trend: number;
  href: string;
}
