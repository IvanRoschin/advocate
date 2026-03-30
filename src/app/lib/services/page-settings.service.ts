import { pageSettingsRepo } from '@/app/lib/repositories/page-settings.repo';
import { dbConnect } from '@/app/lib/server/mongoose';
import { defaultArticleLayout } from '@/app/resources/content/pages/article.layout';
import { defaultServiceLayout } from '@/app/resources/content/pages/service.layout';
import type {
  ArticleLayoutNode,
  PageSettingsResponseDTO,
  ServiceLayoutNode,
} from '@/app/types';

const getDefaultLayoutByEntity = (entity: 'article' | 'service') => {
  switch (entity) {
    case 'article':
      return defaultArticleLayout;
    case 'service':
      return defaultServiceLayout;
    default:
      return [];
  }
};

export const pageSettingsService = {
  async getByEntity(
    entity: 'article' | 'service'
  ): Promise<PageSettingsResponseDTO> {
    await dbConnect();

    const settings = await pageSettingsRepo.findByEntity(entity).lean();

    if (!settings) {
      return {
        _id: 'default',
        entity,
        layout: getDefaultLayoutByEntity(entity),
      };
    }

    return {
      _id: settings._id.toString(),
      entity: settings.entity,
      layout:
        Array.isArray(settings.layout) && settings.layout.length > 0
          ? settings.layout
          : getDefaultLayoutByEntity(entity),
      createdAt: settings.createdAt?.toISOString(),
      updatedAt: settings.updatedAt?.toISOString(),
    };
  },
  async getArticleLayout(): Promise<ArticleLayoutNode[]> {
    const settings = await this.getByEntity('article');

    return Array.isArray(settings.layout)
      ? (settings.layout as ArticleLayoutNode[])
      : defaultArticleLayout;
  },

  async getServiceLayout(): Promise<ServiceLayoutNode[]> {
    const settings = await this.getByEntity('service');

    return Array.isArray(settings.layout)
      ? (settings.layout as ServiceLayoutNode[])
      : defaultServiceLayout;
  },
  async update(data: {
    entity: 'article' | 'service';
    layout: unknown[];
  }): Promise<PageSettingsResponseDTO> {
    await dbConnect();

    const saved = await pageSettingsRepo.upsertByEntity(data);

    return {
      _id: saved._id.toString(),
      entity: saved.entity,
      layout: Array.isArray(saved.layout) ? saved.layout : [],
      createdAt: saved.createdAt?.toISOString(),
      updatedAt: saved.updatedAt?.toISOString(),
    };
  },
};
