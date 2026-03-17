import { AdminDashboardStat } from '../_components/admin-dashboard';

export const ADMIN_DASHBOARD_STATS: AdminDashboardStat[] = [
  {
    title: 'Клиенты',
    value: '512',
    icon: 'clients',
    color: 'bg-teal-500',
    trend: 80,
    href: '/admin/clients',
  },
  {
    title: 'Пользователи',
    value: '1,245',
    icon: 'users',
    color: 'bg-blue-500',
    trend: 75,
    href: '/admin/users',
  },
  {
    title: 'Статьи',
    value: '78',
    icon: 'articles',
    color: 'bg-green-500',
    trend: 60,
    href: '/admin/articles',
  },
  {
    title: 'Послуги',
    value: '24',
    icon: 'services',
    color: 'bg-indigo-500',
    trend: 70,
    href: '/admin/services',
  },
  {
    title: 'Категории',
    value: '12',
    icon: 'categories',
    color: 'bg-yellow-500',
    trend: 90,
    href: '/admin/categories',
  },
  {
    title: 'Лиды',
    value: '34',
    icon: 'leads',
    color: 'bg-pink-500',
    trend: 55,
    href: '/admin/leads',
  },
];
