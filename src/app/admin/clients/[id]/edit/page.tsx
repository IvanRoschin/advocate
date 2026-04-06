import { EmptyState } from '@/app/components';
import { caseAdminService } from '@/app/lib/services/case-admin.service';
import { clientService } from '@/app/lib/services/client.service';
import ClientEditorClient from '../../_components/ClientEditorClient';

type EditClientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;

  const [client, cases] = await Promise.all([
    clientService.getById(id),
    caseAdminService.getByClientId(id),
  ]);
  if (!client) {
    return (
      <div className="container">
        <EmptyState title="Клієнти відсутні" />
      </div>
    );
  }

  return (
    <ClientEditorClient
      mode="edit"
      clientId={id}
      initialValues={{
        type: client.type,
        status: client.status,
        fullName: client.fullName,
        email: client.email,
        phone: client.phone,
        companyName: client.companyName,
        taxId: client.taxId,
        address: client.address,
        notes: client.notes,
      }}
      initialCases={cases}
    />
  );
}
