import type { AnyObjectSchema } from 'yup';

import { ValidationError } from '@/lib/errors/http-errors';

export async function validate<T>(
  schema: AnyObjectSchema,
  data: unknown
): Promise<T> {
  try {
    return (await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    })) as T;
  } catch (err) {
    if (err instanceof Error) {
      throw new ValidationError(err.message);
    }
    throw err;
  }
}
