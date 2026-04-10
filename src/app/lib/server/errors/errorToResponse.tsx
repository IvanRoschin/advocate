import { NextResponse } from 'next/server';
import { ValidationError as YupValidationError } from 'yup';

import type { ApiResponse } from '@/app/lib/server/ApiError';
import { ApiError } from './ApiError';
import { isMongoDuplicateKeyError } from './isMongoDuplicateKeyError';
export function errorToResponse(err: unknown) {
  if (isMongoDuplicateKeyError(err)) {
    return NextResponse.json<ApiResponse<null>>(
      {
        ok: false,
        error: {
          code: 'DUPLICATE_KEY',
          message: 'Resource already exists',
        },
      },
      { status: 409 }
    );
  }

  if (err instanceof YupValidationError) {
    return NextResponse.json<ApiResponse<null>>(
      {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: err.errors[0] ?? 'Validation failed',
        },
      },
      { status: 422 }
    );
  }

  if (err instanceof ApiError) {
    return NextResponse.json<ApiResponse<null>>(
      {
        ok: false,
        error: {
          code: err.code,
          message: err.message,
        },
      },
      { status: err.status }
    );
  }

  console.error('[UNHANDLED_API_ERROR]', err);

  return NextResponse.json<ApiResponse<null>>(
    {
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong',
      },
    },
    { status: 500 }
  );
}
