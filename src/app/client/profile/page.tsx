import { clientAccessActions } from '@/app/actions/client-access.actions';

import ClientProfilePageClient from './_components/ClientProfilePageClient';

export default async function ClientProfilePage() {
  const profile = await clientAccessActions.getMyProfile();

  return <ClientProfilePageClient initialProfile={profile} />;
}
