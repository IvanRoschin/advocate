import { dbConnect } from '@/app/lib/server/mongoose';

/* ========================= BASE ACTION ========================= */

export function createAction<TResult>(
  handler: () => Promise<TResult>,
  options?: { buildFallback: TResult }
): () => Promise<TResult>;

export function createAction<TArgs, TResult>(
  handler: (ctx: { args: TArgs }) => Promise<TResult>,
  options?: { buildFallback: TResult }
): (args: TArgs) => Promise<TResult>;

export function createAction<TArgs, TResult>(
  handler:
    | (() => Promise<TResult>)
    | ((ctx: { args: TArgs }) => Promise<TResult>),
  options?: { buildFallback: TResult }
) {
  return async (args?: TArgs): Promise<TResult> => {
    const conn = await dbConnect();

    if (!conn && options && 'buildFallback' in options) {
      return options.buildFallback;
    }

    if (handler.length === 0) {
      return (handler as () => Promise<TResult>)();
    }

    return (handler as (ctx: { args: TArgs }) => Promise<TResult>)({
      args: args as TArgs,
    });
  };
}
