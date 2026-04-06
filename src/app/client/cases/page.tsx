import { clientCabinetService } from '@/app/lib/services/client-access.service';
import ClientCasesPageClient from './_components/ClientCasesPageClient';

export default async function ClientCasesPage() {
  const overview = await clientCabinetService.getMyOverview();

  return <ClientCasesPageClient initialCases={overview.cases} />;
}
