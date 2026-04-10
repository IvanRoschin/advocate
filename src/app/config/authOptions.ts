import { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import User from '@/models/User';
import { resolveActiveClientAccess } from '../lib/auth/resolveActiveClientAccess';
import { dbConnect } from '../lib/server/mongoose';
import { routes } from './routes';
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      phone: string;
      surname: string;
      isActive: boolean;
      activeClientId?: string;
      clientAccessRole?: 'owner' | 'manager' | 'viewer';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    phone?: string;
    surname?: string;
    name?: string | null;
    email?: string | null;
    isActive?: boolean;
    activeClientId?: string;
    clientAccessRole?: 'owner' | 'manager' | 'viewer';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    phone?: string;
    surname?: string;
    name?: string | null;
    email?: string | null;
    isActive?: boolean;
    activeClientId?: string;
    clientAccessRole?: 'owner' | 'manager' | 'viewer';
  }
}

export type AuthUser = {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  activeClientId?: string;
  clientAccessRole?: 'owner' | 'manager' | 'viewer';
};

export const AUTH_ERROR_CODES = {
  MISSING_CREDENTIALS: 'AUTH_MISSING_CREDENTIALS',
  USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  INVALID_PASSWORD: 'AUTH_INVALID_PASSWORD',
  USER_NOT_ACTIVATED: 'AUTH_USER_NOT_ACTIVATED',
  UNKNOWN: 'AUTH_UNKNOWN',
} as const;

async function loadUserSessionContext(userId: string) {
  const dbUser = await User.findById(userId).lean();

  if (!dbUser) {
    return null;
  }

  const accessContext = await resolveActiveClientAccess(dbUser._id.toString());

  return {
    id: dbUser._id.toString(),
    name: dbUser.name || '',
    email: dbUser.email || '',
    role: dbUser.role,
    phone: dbUser.phone || '',
    surname: dbUser.surname || '',
    isActive: dbUser.isActive ?? false,
    activeClientId: accessContext.activeClientId,
    clientAccessRole: accessContext.clientAccessRole,
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
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error(AUTH_ERROR_CODES.MISSING_CREDENTIALS);
        }

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error(AUTH_ERROR_CODES.USER_NOT_FOUND);
        }

        const isActiveted = await user.isActive;

        if (!isActiveted) {
          throw new Error(AUTH_ERROR_CODES.USER_NOT_ACTIVATED);
        }

        const isCorrect = await user.comparePassword(password);

        if (!isCorrect) {
          throw new Error(AUTH_ERROR_CODES.INVALID_PASSWORD);
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          surname: user.surname || '',
          role: user.role,
          isActive: user.isActive,
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
              email: profile.email?.toLowerCase(),
              googleId: profile.sub,
              phone: '',
              role: 'client',
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
          isActive: user.isActive,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      await dbConnect();

      if (user) {
        token.id = (user as AuthUser).id;
        token.role = (user as AuthUser).role;
        token.phone = (user as AuthUser).phone;
        token.surname = (user as AuthUser).surname;
        token.name = (user as AuthUser).name;
        token.email = (user as AuthUser).email;
        token.isActive = (user as AuthUser).isActive;
        token.activeClientId = (user as AuthUser).activeClientId;
        token.clientAccessRole = (user as AuthUser).clientAccessRole;
      }

      if (trigger === 'update' && session?.user) {
        const typedToken = token as JWT & Record<string, unknown>;

        Object.entries(session.user).forEach(([key, value]) => {
          typedToken[key] = value;
        });

        return typedToken;
      }
      if (token.id) {
        const fullData = await loadUserSessionContext(token.id.toString());

        if (fullData) {
          Object.assign(token, fullData);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (!token?.id) {
        return {
          ...session,
          user: undefined,
        };
      }

      session.user = {
        ...session.user,
        id: token.id,
        role: token.role || '',
        phone: token.phone || '',
        surname: token.surname || '',
        name: token.name ?? null,
        email: token.email ?? '',
        isActive: token.isActive ?? false,
        activeClientId: token.activeClientId,
        clientAccessRole: token.clientAccessRole,
      };

      return session;
    },
  },
};
