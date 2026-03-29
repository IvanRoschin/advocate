import { leadService } from '@/app/lib/services/lead.service';
import LeadEditorClient from '../../_components/LeadEditorClient';

export const dynamic = 'force-dynamic';

type EditLeadPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  const { id } = await params;

  const lead = await leadService.getById(id);

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
