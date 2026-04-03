import type { Metadata } from 'next';

import { contact } from '@/app/resources';
import { CONTACT_PAGE_LAYOUT } from '@/app/resources/content/pages/contact.layout';
import {
  CONTACT_PAGE_SECTIONS,
  ContactPageProps,
} from './_components/contact.sections';

const contactPageData: ContactPageProps = {
  phone: contact.phonePretty,
  email: contact.email,
  address: contact.address,
  city: contact.city,
  region: contact.region,
  postalCode: contact.postalCode,
  country: contact.country,
  latitude: contact.latitude,
  longitude: contact.longitude,
  workHours: contact.workHours,
  mapEmbedUrl: contact.mapEmbedUrl,
};

export const metadata: Metadata = {
  title: contact.seo.title,
  description: contact.seo.description,
  alternates: {
    canonical: contact.seo.canonical,
  },
  openGraph: {
    title: contact.seo.openGraph.title,
    description: contact.seo.openGraph.description,
    type: contact.seo.openGraph.type,
    url: contact.seo.openGraph.url,
  },
};

function buildJsonLd(data: typeof contact) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.structuredData.organizationName,
    url: data.structuredData.siteUrl,
    email: data.email,
    telephone: data.phonePretty,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      addressLocality: data.city,
      addressRegion: data.region,
      postalCode: data.postalCode,
      addressCountry: data.country ?? 'UA',
    },
  };

  const legalService = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: data.structuredData.organizationName,
    url: `${data.structuredData.siteUrl}${data.path}`,
    email: data.email,
    telephone: data.phonePretty,
    areaServed: data.city,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      addressLocality: data.city,
      addressRegion: data.region,
      postalCode: data.postalCode,
      addressCountry: data.country ?? 'UA',
    },
    geo:
      typeof data.latitude === 'number' && typeof data.longitude === 'number'
        ? {
            '@type': 'GeoCoordinates',
            latitude: data.latitude,
            longitude: data.longitude,
          }
        : undefined,
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.seo.title,
    url: `${data.structuredData.siteUrl}${data.path}`,
    description: data.seo.description,
  };

  return [organization, legalService, webPage];
}

export default function ContactPage() {
  const jsonLd = buildJsonLd(contact);

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}

      {CONTACT_PAGE_LAYOUT.map(sectionKey => {
        const Section = CONTACT_PAGE_SECTIONS[sectionKey];
        return <Section key={sectionKey} {...contactPageData} />;
      })}
    </>
  );
}
