import { LayoutNode } from '@/app/lib/layouts/renderLayout';

import { defaultArticleLayout } from './article.layout';
import { defaultHomeLayout } from './home.layout';
import { defaultServiceLayout } from './service.layout';

import type { PageSettingsEntity } from '@/app/types';
export const defaultLayouts: Record<PageSettingsEntity, LayoutNode<string>[]> =
  {
    home: defaultHomeLayout,
    service: defaultServiceLayout,
    article: defaultArticleLayout,
  };
