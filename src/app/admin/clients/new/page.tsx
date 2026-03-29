import ClientEditorClient from '../_components/ClientEditorClient';

export const dynamic = 'force-dynamic';

export default async function NewClientPage() {
  return <ClientEditorClient mode="create" />;
}
