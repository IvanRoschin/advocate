import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/app/components';
import { authOptions } from '@/app/config/authOptions';
import { getRedirectByRole } from '@/app/lib/auth/getRedirectByRole';

import AuthCard from '../_components/AuthCard';

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect(getRedirectByRole(session.user.role));
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
