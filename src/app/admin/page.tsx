import { adminDashboardActions } from '../actions/admin-dashboard.actions';
import AdminStatGroup from './_components/AdminStatGroup';
import { groupAdminStats } from './_lib/group-admin-stats';

export default async function AdminPage() {
  const { stats } = await adminDashboardActions.getCounters();
  const sections = groupAdminStats(stats);

  return (
    <div className="space-y-8 p-6">
      {sections.map(section => (
        <AdminStatGroup
          key={section.group.key}
          title={section.group.title}
          description={section.group.description}
          items={section.items}
        />
      ))}
    </div>
  );
}
