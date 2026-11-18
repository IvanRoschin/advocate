import type { LeadAttributionDTO, LeadTouchDTO } from './lead.dto';

const TOUCH_KEYS = [
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'utmTerm',
  'utmContent',
  'gclid',
  'fbclid',
  'referrer',
  'landingPage',
  'at',
] as const satisfies readonly (keyof LeadTouchDTO)[];

/** Keeps only non-empty string fields; returns undefined for an empty touch. */
function cleanTouch(raw: unknown): LeadTouchDTO | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const src = raw as Record<string, unknown>;
  const out: LeadTouchDTO = {};
  for (const key of TOUCH_KEYS) {
    const v = src[key];
    if (typeof v === 'string' && v.trim()) out[key] = v.trim().slice(0, 300);
  }
  return Object.keys(out).length ? out : undefined;
}

/** Normalizes attribution from a request or a DB document. */
export function cleanLeadAttribution(
  raw: unknown
): LeadAttributionDTO | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const src = raw as Record<string, unknown>;
  const first = cleanTouch(src.first);
  const last = cleanTouch(src.last);
  if (!first && !last) return undefined;
  return { ...(first ? { first } : {}), ...(last ? { last } : {}) };
}

/**
 * Short human label for a touch, e.g. "google / cpc / borgy-kyiv",
 * "google ads (gclid)", "instagram.com", "прямий захід".
 */
export function describeLeadTouch(touch?: LeadTouchDTO): string {
  if (!touch) return 'невідомо';
  if (touch.utmSource) {
    return [touch.utmSource, touch.utmMedium, touch.utmCampaign]
      .filter(Boolean)
      .join(' / ');
  }
  if (touch.gclid) return 'google ads (gclid)';
  if (touch.fbclid) return 'facebook / instagram (fbclid)';
  if (touch.referrer) {
    try {
      return new URL(touch.referrer).host.replace(/^www\./, '');
    } catch {
      return touch.referrer;
    }
  }
  return 'прямий захід';
}
