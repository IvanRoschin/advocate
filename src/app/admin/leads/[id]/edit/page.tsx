import { leadActions } from '@/app/actions/lead.actions';

import LeadEditorClient from '../../_components/LeadEditorClient';

type EditLeadPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  const { id } = await params;

  const lead = await leadActions.getById(id);

  return (
    <LeadEditorClient
      mode="edit"
      leadId={id}
      initialValues={{
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        source: lead.source,
        status: lead.status,
        convertedToClient: lead.convertedToClient,
      }}
    />
  );
}
