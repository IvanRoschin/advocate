import { NextResponse } from 'next/server';

import type { ApiResponse } from '@/lib/api-response';
import { ApiError } from './api-error';
import { isMongoDuplicateKeyError } from './mongo-errors';
/**
 * Преобразует любую ошибку в стандартизированный HTTP response
 * Используется во всех route.ts и server actions
 */
export function errorToResponse(err: unknown) {
  /**
   * 1️⃣ MongoDB duplicate key (409 Conflict)
   * Обрабатываем ПЕРВЫМ, т.к. это не ApiError
   */
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

  /**
   * 2️⃣ Явные API ошибки (400 / 401 / 404 / 501 / etc.)
   */
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

  /**
   * 3️⃣ Всё остальное — Internal Server Error
   * Логируем ОБЯЗАТЕЛЬНО
   */
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
