import type React from 'react';

import { Breadcrumbs } from '@/app/components';

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-wrapper min-h-screen">
      <div className="max-w-6xl py-10">
        <Breadcrumbs />
      </div>
      <>{children}</>
    </div>
  );
}
