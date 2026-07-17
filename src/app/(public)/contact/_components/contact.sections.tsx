import type { ReactNode } from 'react';

import Footer from '@/app/components/footer/Footer';
import { ContactPageSectionKey } from '@/app/resources/content/pages/contact.layout';
import { Header } from '@/components';

import ContactHero from './ContactHero';
import ContactInfo from './ContactInfo';
import ContactMap from './ContactMap';
import ContactRequestForm from './ContactRequestForm';
import ContactSchedule from './ContactSchedule';

export type ContactPageProps = {
  phone: string;
  email: string;
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  workHours?: Array<{ day: string; hours: string }>;
  mapEmbedUrl?: string;
};

export type ContactPageSectionComponent = (
  props: ContactPageProps
) => ReactNode;

const ContactHeaderSection: ContactPageSectionComponent = () => <Header />;

const ContactHeroSection: ContactPageSectionComponent = ({
  phone,
  email,
  city,
}) => <ContactHero phone={phone} email={email} city={city} />;

const ContactInfoSection: ContactPageSectionComponent = ({
  phone,
  email,
  address,
  city,
}) => <ContactInfo phone={phone} email={email} address={address} city={city} />;

const ContactScheduleSection: ContactPageSectionComponent = ({ workHours }) => (
  <ContactSchedule workHours={workHours} />
);

const ContactFormSection: ContactPageSectionComponent = () => (
  <ContactRequestForm />
);

const ContactMapSection: ContactPageSectionComponent = ({
  mapEmbedUrl,
  address,
}) => <ContactMap mapEmbedUrl={mapEmbedUrl} address={address} />;

const ContactFooterSection: ContactPageSectionComponent = () => (
  <section className="mt-16 lg:mt-20">
    <Footer />
  </section>
);

export const CONTACT_PAGE_SECTIONS: Record<
  ContactPageSectionKey,
  ContactPageSectionComponent
> = {
  header: ContactHeaderSection,
  hero: ContactHeroSection,
  info: ContactInfoSection,
  schedule: ContactScheduleSection,
  form: ContactFormSection,
  map: ContactMapSection,
  footer: ContactFooterSection,
};
