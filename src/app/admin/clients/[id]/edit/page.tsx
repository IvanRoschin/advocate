import { casePublicActions } from '@/app/actions/case-admin.actions';
import { clientActions } from '@/app/actions/client.actions';
import { EmptyState } from '@/app/components';

import ClientEditorClient from '../../_components/ClientEditorClient';

type EditClientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;

  const [client, cases] = await Promise.all([
    clientActions.getById(id),
    casePublicActions.getCasesByClientId(id),
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
