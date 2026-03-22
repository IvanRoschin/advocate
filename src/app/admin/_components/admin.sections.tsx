import type { ReactNode } from 'react';

import { Header, Socials } from '@/components';

import AdminSidebar from '../components/AdminSidebar';

import type { AdminSectionKey } from '@/app/resources/content/pages/admin.layout';
export type AdminSectionProps = {
  children: ReactNode;
};

type AdminSectionComponent = (props: AdminSectionProps) => ReactNode;

const AdminSocialsSection: AdminSectionComponent = () => <Socials />;

const AdminHeaderSection: AdminSectionComponent = () => (
  <Header scope="admin" showCta={false} />
);

const AdminSidebarSection: AdminSectionComponent = () => <AdminSidebar />;

const AdminContentSection: AdminSectionComponent = ({ children }) => (
  <section className="bg-app min-w-0 flex-1">
    <div className="min-h-screen px-4 py-6 lg:px-6">{children}</div>
  </section>
);

export const ADMIN_SECTIONS: Record<AdminSectionKey, AdminSectionComponent> = {
  socials: AdminSocialsSection,
  header: AdminHeaderSection,
  sidebar: AdminSidebarSection,
  content: AdminContentSection,
};
