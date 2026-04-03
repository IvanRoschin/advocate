import type { ReactNode } from 'react';

import { AdminSectionKey } from '@/app/resources/content/pages/admin.layout';
import { Header, Socials } from '@/components';

import AdminMobileMenu from './AdminMobileMenu';
import AdminSidebar from './AdminSidebar';

export type AdminSectionProps = {
  children: ReactNode;
};

type AdminSectionComponent = (props: AdminSectionProps) => ReactNode;

const AdminSocialsSection: AdminSectionComponent = () => <Socials />;

const AdminHeaderSection: AdminSectionComponent = () => (
  <>
    <Header scope="admin" showCta={false} />
    <AdminMobileMenu />
  </>
);

const AdminSidebarSection: AdminSectionComponent = () => (
  <div className="hidden xl:block">
    <AdminSidebar />
  </div>
);

const AdminContentSection: AdminSectionComponent = ({ children }) => (
  <section className="bg-app min-w-0 flex-1">
    <div className="min-h-screen w-full px-4 py-4 sm:px-5 md:px-6 md:py-6 xl:px-8">
      {children}
    </div>
  </section>
);

export const ADMIN_SECTIONS: Record<AdminSectionKey, AdminSectionComponent> = {
  socials: AdminSocialsSection,
  header: AdminHeaderSection,
  sidebar: AdminSidebarSection,
  content: AdminContentSection,
};
