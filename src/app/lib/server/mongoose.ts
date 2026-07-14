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
  const uri = serverEnv.mongoUri;

  if (!uri) {
    if (isBuildPhase) {
      console.warn(
        'MONGODB_URI missing — пропускаємо підключення (SKIP_DB_ON_BUILD)'
      );
      return null;
    }

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
