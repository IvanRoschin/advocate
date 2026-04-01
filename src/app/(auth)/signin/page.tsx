// app/(public)/auth/signin/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/app/components';
import { authOptions } from '@/app/config/authOptions';
import { UserRole } from '@/types';

import AuthCard from '../_components/AuthCard';

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const role = session.user.role as UserRole;
    redirect(role === UserRole.ADMIN ? '/admin' : '/client');
  }

  return (
    <AuthCard
      title="Увійти в кабінет"
      description="Введіть ваші дані для входу в особистий кабінет."
    >
      <LoginForm />
    </AuthCard>
  );
};

export default SignInPage;
