import type { IconName } from '@/app/resources/icons';

export type AdminDashboardStatColor =
  | 'bg-teal-500'
  | 'bg-blue-500'
  | 'bg-green-500'
  | 'bg-indigo-500'
  | 'bg-yellow-500'
  | 'bg-purple-500'
  | 'bg-pink-500'
  | 'bg-red-500';

export interface AdminDashboardStatDTO {
  key:
    | 'clients'
    | 'users'
    | 'articles'
    | 'services'
    | 'categories'
    | 'orders'
    | 'leads'
    | 'reviews'
    | 'pageSettings';
  title: string;
  value: number;
  formattedValue: string;
  icon: IconName;
  color: AdminDashboardStatColor;
  trend: number;
  href: string;
}

export interface AdminDashboardCountersDTO {
  clients: number;
  users: number;
  articles: number;
  services: number;
  categories: number;
  subscribers: number;
  leads: number;
  reviews: number;
  pageSettings: number;
}

export interface AdminDashboardResponseDTO {
  stats: AdminDashboardStatDTO[];
}
