import { iconLibrary } from '@/app/resources/icons';
import { AppLink } from '@/components';
import type { AdminDashboardStatDTO } from '@/types';

interface Props {
  item: AdminDashboardStatDTO;
}

export default function AdminStatCard({ item }: Props) {
  const Icon = iconLibrary[item.icon];

  return (
    <AppLink
      href={item.href}
      aria-label={`Перейти до розділу "${item.title}"`}
      className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`${item.color} absolute top-0 left-0 h-1.5 w-full`} />

      <div className="relative z-10 flex items-center gap-4 p-6">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-zinc-500">{item.title}</h3>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">
            {item.formattedValue}
          </p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={`${item.color} h-full rounded-full transition-all duration-300`}
              style={{ width: `${item.trend}%` }}
            />
          </div>
        </div>
      </div>
    </AppLink>
  );
}
