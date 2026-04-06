import { routes } from '@/app/config/routes';

export type AdminDashboardGroupKey =
  | 'crm'
  | 'content'
  | 'finance'
  | 'ui'
  | 'system'
  | 'other';

export type AdminDashboardGroup = {
  key: AdminDashboardGroupKey;
  title: string;
  description: string;
  routes: readonly string[];
};

export const adminDashboardGroups: AdminDashboardGroup[] = [
  {
    key: 'crm',
    title: 'CRM',
    description: 'Ліди, клієнти та робота з зверненнями.',
    routes: [routes.admin.crm.leads, routes.admin.crm.clients],
  },
  {
    key: 'content',
    title: 'Контент',
    description: 'Статті, категорії, послуги та контентні сутності.',
    routes: [
      routes.admin.content.articles,
      routes.admin.content.categories,
      routes.admin.content.services,
      routes.admin.content.tags,
    ],
  },
  {
    key: 'finance',
    title: 'Фінанси',
    description: 'Платежі та супровід фінансових операцій.',
    routes: [routes.admin.finance.payments],
  },
  {
    key: 'ui',
    title: 'UI / Вітрина',
    description: 'Відгуки, слайди та публічні візуальні блоки.',
    routes: [
      routes.admin.ui.reviews,
      routes.admin.ui.slides,
      routes.admin.ui.pageSettings,
    ],
  },
  {
    key: 'system',
    title: 'Система',
    description: 'Користувачі та системні сутності адмін-панелі.',
    routes: [routes.admin.users, routes.admin.dashboard],
  },
];
