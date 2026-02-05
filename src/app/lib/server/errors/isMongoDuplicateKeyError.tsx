import type { MongoServerError } from 'mongodb';

export function isMongoDuplicateKeyError(
  err: unknown
): err is MongoServerError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === 11000
  );
}
