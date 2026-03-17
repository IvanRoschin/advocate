import { dbConnect } from '../lib/server/mongoose';
import { adminDashboardService } from '../lib/services/admin-dashboard.service';
import AdminStatCard from './_components/AdminStatCard';

export default async function AdminPage() {
  await dbConnect();
  const { stats } = await adminDashboardService.getDashboard();
  return (
    <section className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      {stats.map(item => (
        <AdminStatCard key={item.key} item={item} />
      ))}
    </section>
  );
}
