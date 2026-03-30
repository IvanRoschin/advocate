import { dbConnect } from '../lib/server/mongoose';
import { adminDashboardService } from '../lib/services/admin-dashboard.service';
import AdminStatGroup from './_components/AdminStatGroup';
import { groupAdminStats } from './_lib/group-admin-stats';

export default async function AdminPage() {
  await dbConnect();
  const { stats } = await adminDashboardService.getDashboard();
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
