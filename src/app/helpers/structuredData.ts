import { contact } from '@/app/resources';

/**
 * Sitewide Organization + LegalService JSON-LD, rendered once in the root
 * layout so every page (not just /contact) carries the business's
 * structured data.
 *
 * Service-area business: no street address is published (no public office;
 * meetings by appointment in Kyiv or online) — only locality/region and
 * areaServed, consistent with the Google Business Profile.
 */
export function buildSiteJsonLd() {
  const {
    structuredData,
    email,
    phonePretty,
    city,
    region,
    country,
    serviceArea,
  } = contact;

  const postalAddress = {
    '@type': 'PostalAddress',
    addressLocality: city,
    addressRegion: region,
    addressCountry: country ?? 'UA',
  };

  const areaServed = (serviceArea?.length ? serviceArea : [city]).map(name => ({
    '@type': /област/i.test(name) ? 'AdministrativeArea' : 'City',
    name,
  }));

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: structuredData.organizationName,
    url: structuredData.siteUrl,
    email,
    telephone: phonePretty,
    address: postalAddress,
  };

  const legalService = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: structuredData.organizationName,
    url: structuredData.siteUrl,
    email,
    telephone: phonePretty,
    areaServed,
    address: postalAddress,
  };

  return [organization, legalService];
}
