import { contact } from '@/app/resources';

/**
 * Sitewide Organization + LegalService JSON-LD, rendered once in the root
 * layout so every page (not just /contact) carries the business's
 * structured data.
 */
export function buildSiteJsonLd() {
  const { structuredData, email, phonePretty, city, region, postalCode, country, latitude, longitude, address } =
    contact;

  const postalAddress = {
    '@type': 'PostalAddress',
    streetAddress: address,
    addressLocality: city,
    addressRegion: region,
    postalCode,
    addressCountry: country ?? 'UA',
  };

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
    areaServed: city,
    address: postalAddress,
    geo:
      typeof latitude === 'number' && typeof longitude === 'number'
        ? {
            '@type': 'GeoCoordinates',
            latitude,
            longitude,
          }
        : undefined,
  };

  return [organization, legalService];
}
