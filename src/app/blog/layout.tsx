'use client';

import type React from 'react';
import { Header, Socials } from '../components';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-wrapper min-h-screen">
      <Socials />
      <Header />
      <div className="mx-auto w-full max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
