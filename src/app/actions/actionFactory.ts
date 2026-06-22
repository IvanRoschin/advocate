type ActionHandler<TArgs, TResult> = (ctx: { args: TArgs }) => Promise<TResult>;

export function createAction<TArgs = void, TResult = void>(options: {
  handler: ActionHandler<TArgs, TResult>;
}) {
  return async (args: TArgs): Promise<TResult> => {
    return options.handler({ args });
  };
}
