import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/config/authOptions';
import { routes } from '@/app/config/routes';

export default async function AuthRedirectPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect(routes.public.auth.signIn);
  }

  const role = session.user.role;

  if (role === 'admin') {
    return redirect(routes.admin.dashboard);
  }

  if (role === 'customer') {
    return redirect(routes.client.dashboard);
  }

  // fallback
  return redirect('/');
}
