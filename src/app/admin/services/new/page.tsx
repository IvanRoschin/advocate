import ServiceEditorClient from '../../services/_components/ServiceEditorClient';

export const dynamic = 'force-dynamic';

export default async function NewServicePage() {
  return <ServiceEditorClient mode="create" />;
}
