// app/(public)/auth/signin/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/config/authOptions';
import { UserRole } from '@/types';
import SignInClient from './SignInClient';

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const role = session.user.role as UserRole;
    redirect(role === UserRole.ADMIN ? '/admin' : '/client');
  }

  return <SignInClient />;
};

export default SignInPage;
