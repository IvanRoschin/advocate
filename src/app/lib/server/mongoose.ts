import mongoose from 'mongoose';

import { serverEnv } from './env/serverEnv';

declare global {
  var mongoose:
    | {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null;
      }
    | undefined;
}

const cached =
  global.mongoose ?? (global.mongoose = { conn: null, promise: null });

const isBuildPhase = process.env.SKIP_DB_ON_BUILD === 'true';

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (isBuildPhase) {
    console.warn(
      'SKIP_DB_ON_BUILD увімкнено — пропускаємо підключення до MongoDB'
    );
    return null;
  }

  const uri = serverEnv.mongoUri;

  if (!uri) {
    throw new Error('MONGODB_URI missing');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: 'advocate',
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
