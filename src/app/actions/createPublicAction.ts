import 'server-only';
import { checkHoneypot } from '../helpers';
import { verifyTurnstile } from '../helpers/verifyTurnstile';
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
};

export function createPublicAction<TArgs extends PublicActionArgs, TResult>(
  handler: (ctx: { args: TArgs }) => Promise<TResult>,
  options: PublicActionOptions<TResult> = {}
) {
  const { requireTurnstile = true, buildFallback } = options;

  return createAction<TArgs, TResult>(
    async ({ args }) => {
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
