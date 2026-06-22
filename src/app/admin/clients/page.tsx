import { clientService } from '@/app/lib/services/client.service';
import type { ClientResponseDTO } from '@/app/types';
import ClientsClient from './ClientsClient';

const ClientsPage = async () => {
  const clients = (await clientService.getAll()) as ClientResponseDTO[];

  return <ClientsClient initialClients={clients} />;
};

export default ClientsPage;
