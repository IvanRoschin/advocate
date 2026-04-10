import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/app/components';
import { authOptions } from '@/app/config/authOptions';
import { getAccountState } from '@/app/lib/auth/getAccountState';
import { getRedirectByAccountState } from '@/app/lib/auth/getRedirectByAccountState';
import AuthCard from '../_components/AuthCard';

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  const accountState = getAccountState(session);

  if (accountState !== 'guest') {
    redirect(getRedirectByAccountState(accountState));
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
