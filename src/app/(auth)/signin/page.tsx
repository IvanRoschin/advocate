import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/app/components';
import { authOptions } from '@/app/config/authOptions';
import { UserRole } from '@/app/types';
import AuthCard from '../_components/AuthCard';

const SignInPage = async () => {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (role === UserRole.ADMIN || role === UserRole.MANAGER) {
    redirect('/admin');
  }

  if (role === UserRole.CLIENT) {
    redirect('/client');
  }

  if (session?.user) {
    redirect('/');
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
