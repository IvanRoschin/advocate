import { clientService } from '@/app/lib/services/client.service';

import ClientsClient from './ClientsClient';

import type { ClientResponseDTO } from '@/app/types';
const ClientsPage = async () => {
  const clients = (await clientService.getAll()) as ClientResponseDTO[];

  return <ClientsClient initialClients={clients} />;
};

export default ClientsPage;
