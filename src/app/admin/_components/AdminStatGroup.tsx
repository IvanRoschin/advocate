import type { AdminDashboardStatDTO } from '@/types';
import AdminStatCard from './AdminStatCard';

type Props = {
  title: string;
  description?: string;
  items: AdminDashboardStatDTO[];
};

export default function AdminStatGroup({ title, description, items }: Props) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-foreground text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(item => (
          <AdminStatCard key={item.key} item={item} />
        ))}
      </div>
    </section>
  );
}
