import LeadEditorClient from '../_components/LeadEditorClient';

export const dynamic = 'force-dynamic';

export default async function NewLeadPage() {
  return <LeadEditorClient mode="create" />;
}
