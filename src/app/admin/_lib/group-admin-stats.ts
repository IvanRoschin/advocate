import type { AdminDashboardStatDTO } from '@/types';
import {
  AdminDashboardGroup,
  adminDashboardGroups,
} from '../_config/admin-dashboard-groups';

export type GroupedAdminStats = {
  group: AdminDashboardGroup;
  items: AdminDashboardStatDTO[];
};

export function groupAdminStats(
  stats: AdminDashboardStatDTO[]
): GroupedAdminStats[] {
  const grouped = adminDashboardGroups.map(group => ({
    group,
    items: stats.filter(item => group.routes.includes(item.href)),
  }));

  const usedKeys = new Set(
    grouped.flatMap(section => section.items.map(item => item.key))
  );

  const rest = stats.filter(item => !usedKeys.has(item.key));

  if (rest.length > 0) {
    grouped.push({
      group: {
        key: 'other',
        title: 'Інше',
        description: 'Розділи, які не були явно рознесені по групах.',
        routes: [],
      },
      items: rest,
    });
  }

  return grouped.filter(section => section.items.length > 0);
}
