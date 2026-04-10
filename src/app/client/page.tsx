import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { routes } from '@/app/config/routes';
import { authOptions } from '@/config';
import { clientDashboardService } from '@/lib/services/client-dashboard.service';
import ClientPage from './ClientPage';

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(routes.public.auth.signIn);
  }

  if (!session.user.activeClientId) {
    redirect(routes.client.settings.repairClientAccess);
  }

  const data = await clientDashboardService.getByClientId(
    session.user.activeClientId
  );

  return <ClientPage data={data} />;
}
