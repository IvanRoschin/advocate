import 'server-only';

import mongoose from 'mongoose';

import { env } from './env/serverEnv';

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

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  const uri = env.mongoUri;

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI missing');
    }

    console.warn('MONGODB_URI missing - skipping DB connection in dev/build');
    return null;
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

// import mongoose from 'mongoose';

// declare global {
//   var mongooseGlobal: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// }

// // Инициализация глобального singleton
// const globalWithMongoose = global as typeof global & {
//   mongooseGlobal: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// };

// globalWithMongoose.mongooseGlobal = globalWithMongoose.mongooseGlobal || {
//   conn: null,
//   promise: null,
// };

// export const dbConnect = async () => {
//   function getMongoUri() {
//     const uri = process.env.MONGODB_URI;

//     if (!uri) {
//       throw new Error('Missing MONGODB_URI in environment variables');
//     }

//     return uri;
//   }
//   if (mongoose.connection.readyState >= 1) {
//     return mongoose.connection;
//   }
//   mongoose.set('strictQuery', true);

//   if (globalWithMongoose.mongooseGlobal.conn) {
//     console.warn('MongoDB is already connected');
//     return globalWithMongoose.mongooseGlobal.conn;
//   }

//   if (!globalWithMongoose.mongooseGlobal.promise) {
//     const options = {
//       serverSelectionTimeoutMS: 20000,
//       connectTimeoutMS: 20000,
//       dbName: 'advocate',
//     };
//     globalWithMongoose.mongooseGlobal.promise = mongoose.connect(
//       getMongoUri(),
//       options
//     );
//   }

//   try {
//     globalWithMongoose.mongooseGlobal.conn =
//       await globalWithMongoose.mongooseGlobal.promise;
//     console.warn('MongoDB connected');
//     return globalWithMongoose.mongooseGlobal.conn;
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     globalWithMongoose.mongooseGlobal.conn = null;
//     globalWithMongoose.mongooseGlobal.promise = null;
//     throw error;
//   }
// };

// // Опционально: мониторинг состояния
// mongoose.connection.on('connected', () => {
//   console.warn('MongoDB connection established');
// });

// mongoose.connection.on('error', error => {
//   console.error('MongoDB connection error:', error);
//   globalWithMongoose.mongooseGlobal.conn = null;
// });

// mongoose.connection.on('disconnected', () => {
//   console.warn('MongoDB connection lost');
//   globalWithMongoose.mongooseGlobal.conn = null;
// });
