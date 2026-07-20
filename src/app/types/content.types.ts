import type { zones } from 'tzdata';

import type { IconName } from '@/resources/icons';

/**
 * IANA time zone string (e.g., 'Asia/Calcutta', 'Europe/Vienna').
 * See: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 */
type IANATimeZone = Extract<keyof typeof zones, string>; // Narrow to string keys for React usage

/**
 * Represents a person featured in the portfolio.
 */
export type Person = {
  /** First name of the person */
  firstName: string;
  /** Last name of the person */
  lastName: string;
  /** The name you want to display, allows variations like nicknames */
  name: string;
  /** Role or job title */
  role: string;
  /** Path to avatar image */
  avatar: string;
  /** Email address */
  email: string;
  /** Email address */
  location: string;
  /** IANA time zone location */
  timeZone: IANATimeZone;
  /** Languages spoken */
  languages?: string[];
};

/**
 * Social link configuration.
 */
export type Social = Array<{
  /** Name of the social platform */
  name: string;
  /** Icon for the social platform
   * The icons are a part of "src/resources/icons.ts" file.
   * If you need a different icon, import it there and reference it everywhere else
   */
  icon: IconName;
  /**
   * The link to the social platform
   *
   * The link is not validated by code, make sure it's correct
   */
  link: string;
  /** Whether this social link is essential and should be displayed on the about page */
  essential?: boolean;
  visible?: boolean;
}>;

/**
 * Base interface for page configuration with common properties.
 */
interface BasePageConfig {
  /** Path to the page
   *
   * The path should be relative to the public directory
   */
  path: `/${string}` | string;
  /** Label for navigation or display */
  label: string;
  /** Title of the page */
  title: string;
  /** Description for SEO and metadata */
  description: string;
  /** OG Image should be put inside `public/images` folder */
  image?: `/images/${string}` | string;
}

/**
 * Blog page configuration.
 * @description Configuration for the Blog page, including metadata and navigation label.
 */
export type Blog = BasePageConfig;

export type ContactContent = {
  path: string;
  label: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;

  phone: string;
  phonePretty: string;
  phoneSecondary?: string;
  phoneSecondaryPretty?: string;

  email: string;
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  country?: string;

  latitude?: number;
  longitude?: number;

  workHours: Array<{
    day: string;
    hours: string;
  }>;

  mapEmbedUrl?: string;

  seo: {
    title: string;
    description: string;
    canonical: string;
    openGraph: {
      title: string;
      description: string;
      url: string;
      type: 'website';
    };
  };

  structuredData: {
    organizationName: string;
    siteUrl: string;
  };
};
