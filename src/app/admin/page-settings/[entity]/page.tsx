import { pageSettingsActions } from '@/app/actions/page-settings.actions';

import PageSettingsClient from '../_components/PageSettingsClient';

type PageProps = {
  params: Promise<{ entity: 'article' | 'service' | 'home' }>;
};

export default async function PageSettingsEntityPage({ params }: PageProps) {
  const { entity } = await params;
  const layout = await pageSettingsActions.getLayout(entity);

  if (!layout) {
    throw new Error('Layout not found');
  }

  return (
    <PageSettingsClient
      initialSettings={{
        entity,
        layout,
      }}
    />
  );
}
