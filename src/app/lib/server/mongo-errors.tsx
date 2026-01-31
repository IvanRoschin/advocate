import { MongoServerError } from 'mongodb';

export function isMongoDuplicateKeyError(
  err: unknown
): err is MongoServerError {
  return err instanceof MongoServerError && err.code === 11000;
}
