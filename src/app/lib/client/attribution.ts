'use client';

/**
 * Lead attribution: remembers where a visitor came from (UTM tags, Google Ads
 * gclid, external referrer) so a lead submitted later — possibly on another
 * page or another visit — still carries its source.
 *
 * Two touches are kept in localStorage:
 * - first: the very first visit we saw (never overwritten);
 * - last:  the most recent visit that had a real source signal
 *          (UTM / click id / external referrer). Plain internal navigation
 *          never overwrites it.
 *
 * Storage can be unavailable (private mode, blocked cookies) — every access is
 * wrapped so the site and the lead form keep working without attribution.
 */

export type LeadTouch = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPage?: string;
  at?: string;
};

export type LeadAttribution = {
  first?: LeadTouch;
  last?: LeadTouch;
};

const FIRST_KEY = 'lead-attribution-first';
const LAST_KEY = 'lead-attribution-last';
const MAX_LEN = 300;

const PARAM_MAP: Record<string, keyof LeadTouch> = {
  utm_source: 'utmSource',
  utm_medium: 'utmMedium',
  utm_campaign: 'utmCampaign',
  utm_term: 'utmTerm',
  utm_content: 'utmContent',
  gclid: 'gclid',
  fbclid: 'fbclid',
};

const clip = (v: string) => v.trim().slice(0, MAX_LEN);

function read(key: string): LeadTouch | undefined {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as LeadTouch) : undefined;
  } catch {
    return undefined;
  }
}

function write(key: string, touch: LeadTouch) {
  try {
    window.localStorage.setItem(key, JSON.stringify(touch));
  } catch {
    // storage unavailable — attribution is best-effort
  }
}

function externalReferrer(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const ref = new URL(document.referrer);
    if (ref.host === window.location.host) return undefined;
    // Keep only origin + path: referrer query strings can hold personal data.
    return clip(`${ref.origin}${ref.pathname}`);
  } catch {
    return undefined;
  }
}

/** Call on every page view. Cheap and idempotent. */
export function captureAttribution() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const touch: LeadTouch = {};

  for (const [param, field] of Object.entries(PARAM_MAP)) {
    const value = params.get(param);
    if (value) touch[field] = clip(value);
  }

  const referrer = externalReferrer();
  if (referrer) touch.referrer = referrer;

  const hasSignal = Object.keys(touch).length > 0;

  touch.landingPage = clip(window.location.pathname);
  touch.at = new Date().toISOString();

  if (!read(FIRST_KEY)) write(FIRST_KEY, touch);
  if (hasSignal) write(LAST_KEY, touch);
}

/** Attribution to attach to a lead submission. */
export function getAttribution(): LeadAttribution {
  if (typeof window === 'undefined') return {};
  const first = read(FIRST_KEY);
  const last = read(LAST_KEY);
  return {
    ...(first ? { first } : {}),
    ...(last ? { last } : {}),
  };
}
