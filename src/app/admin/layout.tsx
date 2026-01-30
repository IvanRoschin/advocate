'use client';

import { Header, Socials } from '../components';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="blog-wrapper">
      <Socials />
      <Header />
      {children}
    </div>
  );
}
