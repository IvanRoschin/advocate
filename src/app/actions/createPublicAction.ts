import 'server-only';
import { checkHoneypot } from '../helpers';
import { verifyTurnstile } from '../helpers/verifyTurnstile';
import { getClientIp, assertRateLimit } from '../lib/server/rateLimit';
import { ValidationError } from '../lib/server/errors/httpErrors';
import { createAction } from './createAction';

type PublicActionArgs = {
  website?: string;
  turnstileToken?: string;
};

type PublicActionOptions<TResult> = {
  /** За замовчуванням true — вимкнути лише для дій, де Turnstile не потрібен. */
  requireTurnstile?: boolean;
  buildFallback?: TResult;
  /** Ім'я бакета для rate-limit (напр. 'lead', 'subscribe'); за замовчуванням спільний бакет. */
  rateLimitKey?: string;
};

const DEFAULT_RATE_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 };

export function createPublicAction<TArgs extends PublicActionArgs, TResult>(
  handler: (ctx: { args: TArgs }) => Promise<TResult>,
  options: PublicActionOptions<TResult> = {}
) {
  const {
    requireTurnstile = true,
    buildFallback,
    rateLimitKey = 'public-action',
  } = options;

  return createAction<TArgs, TResult>(
    async ({ args }) => {
      const ip = await getClientIp();
      assertRateLimit(`${rateLimitKey}:${ip}`, DEFAULT_RATE_LIMIT);

      await checkHoneypot(args.website);

      if (requireTurnstile) {
        if (!args.turnstileToken) {
          throw new ValidationError('Підтвердіть, що ви не робот');
        }
        await verifyTurnstile(args.turnstileToken);
      }

      return handler({ args });
    },
    buildFallback !== undefined ? { buildFallback } : undefined
  );
}
