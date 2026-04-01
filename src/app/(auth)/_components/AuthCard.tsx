import { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  align?: 'left' | 'center';
};

export default function AuthCard({
  title,
  description,
  children,
  align = 'left',
}: Props) {
  return (
    <div className="bg-background/88 border-border/70 w-full rounded-3xl border p-6 shadow-[0_20px_80px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-8">
      <div className={align === 'center' ? 'text-center' : ''}>
        <h2 className="font-eukrainehead text-2xl font-bold sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
