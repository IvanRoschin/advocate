import { routes } from '@/app/config/routes';

import type {
  AdminDashboardCountersDTO,
  AdminDashboardResponseDTO,
  AdminDashboardStatDTO,
} from './admin-dashboard.dto';

const formatCount = (value: number) =>
  new Intl.NumberFormat('uk-UA').format(value);

export const mapAdminDashboardToResponse = (
  counters: AdminDashboardCountersDTO
): AdminDashboardResponseDTO => {
  const stats: AdminDashboardStatDTO[] = [
    // CRM
    {
      key: 'leads',
      title: 'Ліди',
      value: counters.leads,
      formattedValue: formatCount(counters.leads),
      icon: 'leads',
      color: 'bg-pink-500',
      trend: 55,
      href: routes.admin.crm.leads,
    },
    {
      key: 'clients',
      title: 'Клієнти',
      value: counters.clients,
      formattedValue: formatCount(counters.clients),
      icon: 'clients',
      color: 'bg-teal-500',
      trend: 80,
      href: routes.admin.crm.clients,
    },

    // System
    {
      key: 'users',
      title: 'Користувачі',
      value: counters.users,
      formattedValue: formatCount(counters.users),
      icon: 'users',
      color: 'bg-blue-500',
      trend: 75,
      href: routes.admin.users,
    },

    // Content
    {
      key: 'articles',
      title: 'Статті',
      value: counters.articles,
      formattedValue: formatCount(counters.articles),
      icon: 'articles',
      color: 'bg-green-500',
      trend: 60,
      href: routes.admin.content.articles,
    },
    {
      key: 'services',
      title: 'Послуги',
      value: counters.services,
      formattedValue: formatCount(counters.services),
      icon: 'services',
      color: 'bg-indigo-500',
      trend: 70,
      href: routes.admin.content.services,
    },
    {
      key: 'categories',
      title: 'Категорії',
      value: counters.categories,
      formattedValue: formatCount(counters.categories),
      icon: 'categories',
      color: 'bg-yellow-500',
      trend: 90,
      href: routes.admin.content.categories,
    },

    // UI / Вітрина
    {
      key: 'reviews',
      title: 'Відгуки',
      value: counters.reviews,
      formattedValue: formatCount(counters.reviews),
      icon: 'reviews',
      color: 'bg-purple-500',
      trend: 55,
      href: routes.admin.ui.reviews,
    },
    {
      key: 'slides',
      title: 'Слайди',
      value: counters.slides,
      formattedValue: formatCount(counters.slides),
      icon: 'gallery',
      color: 'bg-fuchsia-500',
      trend: 55,
      href: routes.admin.ui.slides,
    },
    {
      key: 'pageSettings',
      title: 'Налаштування сторінок',
      value: counters.pageSettings,
      formattedValue: formatCount(counters.pageSettings),
      icon: 'settings',
      color: 'bg-rose-500',
      trend: 55,
      href: routes.admin.ui.pageSettings,
    },
  ];

  return { stats };
};
