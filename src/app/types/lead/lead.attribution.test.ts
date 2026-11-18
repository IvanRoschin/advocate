import { describe, expect, it } from 'vitest';

import { createLeadRequestSchema } from './lead.forms';
import { cleanLeadAttribution, describeLeadTouch } from './lead.attribution';

describe('cleanLeadAttribution', () => {
  it('drops empty, non-string and unknown fields', () => {
    expect(
      cleanLeadAttribution({
        first: { utmSource: '  google ', gclid: '', evil: 'x', at: 5 },
        last: {},
      })
    ).toEqual({ first: { utmSource: 'google' } });
  });

  it('returns undefined for garbage', () => {
    expect(cleanLeadAttribution(null)).toBeUndefined();
    expect(cleanLeadAttribution('str')).toBeUndefined();
    expect(cleanLeadAttribution({ first: {}, last: null })).toBeUndefined();
  });

  it('clips long values to 300 chars', () => {
    const r = cleanLeadAttribution({ last: { utmTerm: 'a'.repeat(1000) } });
    expect(r?.last?.utmTerm).toHaveLength(300);
  });
});

describe('describeLeadTouch', () => {
  it('prefers utm tags', () => {
    expect(
      describeLeadTouch({
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'borgy',
      })
    ).toBe('google / cpc / borgy');
  });
  it('falls back to gclid, referrer host, direct', () => {
    expect(describeLeadTouch({ gclid: 'abc' })).toBe('google ads (gclid)');
    expect(describeLeadTouch({ referrer: 'https://www.instagram.com/x' })).toBe(
      'instagram.com'
    );
    expect(describeLeadTouch({ landingPage: '/' })).toBe('прямий захід');
    expect(describeLeadTouch(undefined)).toBe('невідомо');
  });
});

describe('createLeadRequestSchema attribution', () => {
  const base = {
    name: 'Іван',
    email: 'a@b.ua',
    phone: '+380501234567',
    source: 'home',
    consent: true,
    website: '',
    turnstileToken: 't',
  };

  it('accepts a lead without attribution', async () => {
    const r = await createLeadRequestSchema.validate(base, {
      stripUnknown: true,
    });
    expect(r.attribution).toBeUndefined();
  });

  it('keeps known attribution fields and strips unknown ones', async () => {
    const r = await createLeadRequestSchema.validate(
      { ...base, attribution: { last: { utmSource: 'google', hack: 1 } } },
      { stripUnknown: true }
    );
    expect(r.attribution?.last).toEqual({ utmSource: 'google' });
  });
});
