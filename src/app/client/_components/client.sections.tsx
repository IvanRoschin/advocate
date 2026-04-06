import type { ReactNode } from 'react';

import MobileMenu from '@/app/admin/_components/MobileMenu';
import Footer from '@/app/components/footer/Footer';
import { ClientSectionKey } from '@/app/resources/content/pages/client.layout';
import { Header, Socials } from '@/components';
import ClientSidebar from './ClientSidebar';

export type ClientSectionProps = {
  children: ReactNode;
};

type ClientSectionComponent = (props: ClientSectionProps) => ReactNode;

const SocialsSection: ClientSectionComponent = () => <Socials />;

const HeaderSection: ClientSectionComponent = () => (
  <>
    <Header scope="client" showCta={false} />
    <MobileMenu />
  </>
);

const SidebarSection: ClientSectionComponent = () => (
  <div className="hidden xl:block">
    <ClientSidebar />
  </div>
);

const ContentSection: ClientSectionComponent = ({ children }) => (
  <section className="bg-app min-w-0 flex-1">
    <div className="min-h-screen w-full px-4 py-4 sm:px-5 md:px-6 md:py-6 xl:px-8">
      {children}
    </div>
  </section>
);

const FooterSection: ClientSectionComponent = () => <Footer />;

export const CLIENT_SECTIONS: Record<ClientSectionKey, ClientSectionComponent> =
  {
    socials: SocialsSection,
    header: HeaderSection,
    sidebar: SidebarSection,
    content: ContentSection,
    footer: FooterSection,
  };
