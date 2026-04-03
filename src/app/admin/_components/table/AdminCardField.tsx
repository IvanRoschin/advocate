import { ReactNode } from 'react';

type AdminCardFieldProps = {
  label: string;
  value: ReactNode;
};

export function AdminCardField({ label, value }: AdminCardFieldProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="text-foreground min-w-0 text-right text-sm font-medium">
        {value}
      </div>
    </div>
  );
}
