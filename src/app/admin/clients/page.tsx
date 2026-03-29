import { clientService } from '@/app/lib/services/client.service';

import ClientsClient from './_components/ClientsClient';

import type { ClientResponseDTO } from '@/app/types';

export const dynamic = 'force-dynamic';

const ClientsPage = async () => {
  const clients = (await clientService.getAll()) as ClientResponseDTO[];

  return <ClientsClient initialClients={clients} />;
};

export default ClientsPage;
