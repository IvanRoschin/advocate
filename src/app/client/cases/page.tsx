import { clientAccessActions } from '@/app/actions/client-access.actions';

import ClientCasesPageClient from './_components/ClientCasesPageClient';

export default async function ClientCasesPage() {
  const overview = await clientAccessActions.getMyOverview();

  return <ClientCasesPageClient initialCases={overview.cases} />;
}
