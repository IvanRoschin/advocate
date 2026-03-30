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
      className="border-border bg-card hover:bg-muted/40 relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className={`${item.color} absolute top-0 left-0 h-1.5 w-full`} />

      <div className="relative z-10 flex items-center gap-4 p-5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.color}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-muted-foreground text-sm font-medium">
            {item.title}
          </h3>

          <p className="text-foreground mt-1 text-2xl font-semibold">
            {item.formattedValue}
          </p>

          <div className="bg-muted mt-3 h-2 w-full overflow-hidden rounded-full">
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
