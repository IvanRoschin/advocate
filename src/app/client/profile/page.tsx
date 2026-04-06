import { clientCabinetService } from '@/app/lib/services/client-access.service';

import ClientProfilePageClient from './_components/ClientProfilePageClient';

export default async function ClientProfilePage() {
  const profile = await clientCabinetService.getMyProfile();

  return <ClientProfilePageClient initialProfile={profile} />;
}
