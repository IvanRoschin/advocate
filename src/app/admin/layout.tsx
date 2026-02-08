'use client';

import { Header, Socials } from '../components';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="blog-wrapper">
      <Socials />
      <Header />
      <div className="flex">
        <AdminSidebar />
        {children}
      </div>
    </div>
  );
}
