'use client';

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: GtagParams) => void;
  }
}

/**
 * Sends a GA4 event if gtag is loaded (it is only injected when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set). Never throws.
 *
 * Events used on the site — mark them as key events in GA4 and import into
 * Google Ads as conversions:
 * - generate_lead   — lead form submitted successfully
 * - click_phone     — tel: link clicked
 * - click_telegram  — Telegram link clicked
 * - click_viber     — Viber link clicked
 * - click_email     — mailto: link clicked
 */
export function trackEvent(name: string, params?: GtagParams) {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', name, params);
  } catch {
    // analytics must never break the page
  }
}

export type ContactMethod = 'phone' | 'telegram' | 'viber' | 'email';

/** Maps a link href to a contact method, or null if it is not a contact link. */
export function contactMethodFromHref(href: string): ContactMethod | null {
  const h = href.trim().toLowerCase();
  if (h.startsWith('tel:')) return 'phone';
  if (h.startsWith('mailto:')) return 'email';
  if (
    h.startsWith('viber:') ||
    h.includes('viber.com/') ||
    h.includes('viber.me/')
  )
    return 'viber';
  if (h.startsWith('tg:') || h.includes('t.me/') || h.includes('telegram.me/'))
    return 'telegram';
  return null;
}
