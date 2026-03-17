import type React from 'react';

import { Footer, Header } from '@/app/components';

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-wrapper min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
