'use client';

import { iconLibrary } from '@/app/resources/icons';
import { AppLink } from '@/components';

import type { IconName } from '@/app/resources/icons';
const stats: Array<{
  title: string;
  value: string;
  icon: IconName;
  color: string;
  trend: number;
  link: string;
}> = [
  {
    title: 'Клиенты',
    value: '512',
    icon: 'clients',
    color: 'bg-teal-500',
    trend: 80,
    link: 'admin/clients',
  },
  {
    title: 'Пользователи',
    value: '1,245',
    icon: 'users',
    color: 'bg-blue-500',
    trend: 75,
    link: 'admin/users',
  },
  {
    title: 'Статьи',
    value: '78',
    icon: 'articles',
    color: 'bg-green-500',
    trend: 60,
    link: 'admin/articles',
  },
  {
    title: 'Категории',
    value: '12',
    icon: 'categories',
    color: 'bg-yellow-500',
    trend: 90,
    link: 'admin/categories',
  },
  {
    title: 'Заказы',
    value: '12',
    icon: 'orders',
    color: 'bg-purple-500',
    trend: 40,
    link: 'admin/orders',
  },
  {
    title: 'Лиды',
    value: '34',
    icon: 'leads',
    color: 'bg-pink-500',
    trend: 55,
    link: 'admin/leads',
  },
];

const AdminPage = () => {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      {stats.map(stat => {
        const Icon = iconLibrary[stat.icon];

        return (
          <AppLink
            key={stat.title}
            href={stat.link}
            className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className={`${stat.color} absolute top-0 left-0 h-2 w-full`} />

            <div className="relative z-10 flex items-center gap-4 bg-white p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-zinc-500">
                  {stat.title}
                </h3>
                <p className="text-sm text-gray-500">{stat.value}</p>

                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`${stat.color} h-2 rounded-full transition-all`}
                    style={{ width: `${stat.trend}%` }}
                  />
                </div>
              </div>
            </div>
          </AppLink>
        );
      })}
    </div>
  );
};

export default AdminPage;
