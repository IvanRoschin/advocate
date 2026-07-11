import { dbConnect } from '@/app/lib/server/mongoose';

/* ========================= BASE ACTION ========================= */

export function createAction<TResult>(
  handler: () => Promise<TResult>
): () => Promise<TResult>;

export function createAction<TArgs, TResult>(
  handler: (ctx: { args: TArgs }) => Promise<TResult>
): (args: TArgs) => Promise<TResult>;

export function createAction<TArgs, TResult>(
  handler:
    | (() => Promise<TResult>)
    | ((ctx: { args: TArgs }) => Promise<TResult>)
) {
  return async (args?: TArgs): Promise<TResult> => {
    await dbConnect();

    if (handler.length === 0) {
      return (handler as () => Promise<TResult>)();
    }

    return (handler as (ctx: { args: TArgs }) => Promise<TResult>)({
      args: args as TArgs,
    });
  };
}
