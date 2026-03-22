import type { ReactNode } from 'react';

import Footer from '../components/footer/Footer';
import { renderLayout } from '../lib/layouts/renderLayout';
import { adminLayout } from '../resources/content/pages/admin.layout';
import {
  ADMIN_SECTIONS,
  AdminSectionProps,
} from './_components/admin.sections';

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const sectionProps: AdminSectionProps = {
    children,
  };

  return (
    <main className="bg-app relative min-h-screen">
      {renderLayout({
        layout: adminLayout,
        sections: ADMIN_SECTIONS,
        sectionProps,
      })}
      <Footer />
    </main>
  );
}
