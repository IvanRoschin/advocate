import type React from 'react';

import { Header } from '@/app/components';
import Footer from '@/app/components/footer/Footer';

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
