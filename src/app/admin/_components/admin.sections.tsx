import type { ReactNode } from 'react';

import Footer from '@/app/components/footer/Footer';
import { AdminSectionKey } from '@/app/resources/content/pages/admin.layout';
import { Header, Socials } from '@/components';

import AdminSidebar from './AdminSidebar';
import MobileMenu from './MobileMenu';

export type AdminSectionProps = {
  children: ReactNode;
};

type AdminSectionComponent = (props: AdminSectionProps) => ReactNode;

const SocialsSection: AdminSectionComponent = () => <Socials />;

const HeaderSection: AdminSectionComponent = () => (
  <>
    <Header scope="admin" showCta={false} />
    <MobileMenu />
  </>
);

const SidebarSection: AdminSectionComponent = () => (
  <div className="hidden xl:block">
    <AdminSidebar />
  </div>
);

const ContentSection: AdminSectionComponent = ({ children }) => (
  <section className="bg-app min-w-0 flex-1">
    <div className="min-h-screen w-full px-4 py-4 sm:px-5 md:px-6 md:py-6 xl:px-8">
      {children}
    </div>
  </section>
);

const FooterSection: AdminSectionComponent = () => <Footer />;

export const ADMIN_SECTIONS: Record<AdminSectionKey, AdminSectionComponent> = {
  socials: SocialsSection,
  header: HeaderSection,
  sidebar: SidebarSection,
  content: ContentSection,
  footer: FooterSection,
};
