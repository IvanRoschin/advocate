import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/config/authOptions';
import { getAccountState } from '@/app/lib/auth/getAccountState';
import { getRedirectByAccountState } from '@/app/lib/auth/getRedirectByAccountState';

export default async function AuthRedirectPage() {
  const session = await getServerSession(authOptions);

  const accountState = getAccountState(session);
  redirect(getRedirectByAccountState(accountState));
}
