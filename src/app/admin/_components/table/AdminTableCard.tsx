import { ReactNode } from 'react';

type AdminTableCardProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AdminTableCard({
  title,
  subtitle,
  badge,
  children,
  footer,
}: AdminTableCardProps) {
  return (
    <article className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-foreground truncate text-base font-semibold">
            {title}
          </h3>
          {subtitle ? (
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
          ) : null}
        </div>

        {badge ? <div className="shrink-0">{badge}</div> : null}
      </div>

      <div className="mt-4 space-y-3">{children}</div>

      {footer ? <div className="mt-4 border-t pt-4">{footer}</div> : null}
    </article>
  );
}
