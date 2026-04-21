import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/config/authOptions';

import HeaderClient from './HeaderClient';

export default async function Header() {
  const session = await getServerSession(authOptions);

  const publicAuth = {
    isAuthenticated: Boolean(session?.user),
    role: session?.user?.role,
  };

  return <HeaderClient publicAuth={publicAuth} />;
}
