import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/store/theme.store', () => ({ useThemeStore: vi.fn() }));
vi.mock('@/app/lib/client/env/clientEnv', () => ({
  clientEnv: { cloudflare: { turnstileSiteKey: '' } },
}));

import { isRetryableTurnstileError } from './usePublicCaptcha';

describe('isRetryableTurnstileError', () => {
  it('retries challenge-failure families 300*** and 600***', () => {
    expect(isRetryableTurnstileError('600010')).toBe(true);
    expect(isRetryableTurnstileError('300030')).toBe(true);
  });

  it('does not retry config errors', () => {
    expect(isRetryableTurnstileError('110100')).toBe(false);
    expect(isRetryableTurnstileError('400020')).toBe(false);
    expect(isRetryableTurnstileError(undefined)).toBe(false);
  });
});
