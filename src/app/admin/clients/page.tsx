import { clientActions } from '@/app/actions/client.actions';
import type { ClientResponseDTO } from '@/app/types';
import ClientsClient from './ClientsClient';

const ClientsPage = async () => {
  const result = await clientActions.getAll();

  const clients: ClientResponseDTO[] = result.items;

  return <ClientsClient initialClients={clients} />;
};

export default ClientsPage;
