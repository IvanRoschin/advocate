import crypto from 'crypto';

/**
 * Генерация случайного токена
 * @param bytes длина в байтах (по умолчанию 32)
 * @returns hex строка
 */
export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}
