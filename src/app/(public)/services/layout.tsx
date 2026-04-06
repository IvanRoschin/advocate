import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ServicesLayout({ children }: Props) {
  return (
    <div className="blog-wrapper bg-background text-foreground min-h-screen">
      {children}
    </div>
  );
}
