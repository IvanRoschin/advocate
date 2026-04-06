import { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import User from '@/models/User';
import { dbConnect } from '../lib/server/mongoose';
import { routes } from './routes';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      phone: string;
      surname: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    phone?: string;
    surname?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    phone?: string;
    surname?: string;
  }
}

export type AuthUser =
  | { id: string }
  | {
      id: string;
      name?: string;
      surname?: string;
      email?: string;
      phone?: string;
      role?: string;
    };

export const AUTH_ERROR_CODES = {
  MISSING_CREDENTIALS: 'AUTH_MISSING_CREDENTIALS',
  USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  INVALID_PASSWORD: 'AUTH_INVALID_PASSWORD',
  UNKNOWN: 'AUTH_UNKNOWN',
} as const;

async function loadUserData(userId: string) {
  const dbUser = await User.findById(userId).lean();

  return {
    id: dbUser?._id?.toString(),
    role: dbUser?.role,
    phone: dbUser?.phone,
    surname: dbUser?.surname,
  };
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: routes.public.auth.signIn,
  },

  session: {
    strategy: 'jwt',
  },

  providers: [
    Credentials({
      name: 'credentials',

      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const rawPhone = credentials?.phone?.trim();
        const rawPassword = credentials?.password;

        if (!rawPhone || !rawPassword) {
          throw new Error(AUTH_ERROR_CODES.MISSING_CREDENTIALS);
        }

        await dbConnect();

        const phone = rawPhone.replace(/\s+/g, '');
        const user = await User.findOne({ phone });

        if (!user) {
          throw new Error(AUTH_ERROR_CODES.USER_NOT_FOUND);
        }

        const isCorrect = await user.comparePassword(rawPassword);

        if (!isCorrect) {
          throw new Error(AUTH_ERROR_CODES.INVALID_PASSWORD);
        }

        return {
          id: user._id.toString(),
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      async profile(profile) {
        await dbConnect();

        let user = await User.findOne({ googleId: profile.sub });

        if (!user) {
          user = await User.findOne({ email: profile.email });

          if (user) {
            user.googleId = profile.sub;
            await user.save();
          } else {
            user = await User.create({
              name: profile.given_name,
              surname: profile.family_name || '',
              email: profile.email,
              googleId: profile.sub,
              phone: '',
              role: 'customer',
            });
          }
        }

        return {
          id: user._id.toString(),
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      await dbConnect();

      if (user) {
        token.id = (user as AuthUser).id;
      }

      if (trigger === 'update' && session?.user) {
        const typedToken = token as JWT & Record<string, unknown>;

        Object.entries(session.user).forEach(([key, value]) => {
          typedToken[key] = value;
        });

        return typedToken;
      }

      if (token.id) {
        const fullData = await loadUserData(token.id.toString());
        Object.assign(token, fullData);
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        role: token.role || '',
        phone: token.phone || '',
        surname: token.surname || '',
      };

      return session;
    },
  },
};
