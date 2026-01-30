// helpers/validate.ts
import type { AnySchema, InferType } from 'yup';

import { ValidationError } from '@/app/lib/server/errors/http-errors';

export async function validate<S extends AnySchema>(
  schema: S,
  data: unknown
): Promise<InferType<S>> {
  try {
    return await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (err) {
    throw new ValidationError('Validation failed', err);
  }
}
