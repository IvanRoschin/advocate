import { dbConnect } from '@/app/lib/server/mongoose';
import { pageSettingsService } from '@/app/lib/services/page-settings.service';
import PageSettingsClient from '../_components/PageSettingsClient';

type PageProps = {
  params: Promise<{ entity: 'article' | 'service' | 'home' }>;
};

export default async function PageSettingsEntityPage({ params }: PageProps) {
  await dbConnect();

  const { entity } = await params;
  const settings = await pageSettingsService.getByEntity(entity);

  return <PageSettingsClient initialSettings={settings} />;
}
