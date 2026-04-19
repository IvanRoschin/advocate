import type { Types } from 'mongoose';

import {
  firstImage,
  stringArray,
  toIdString,
  toIsoString,
} from '@/app/lib/mappers/_utils';

import type {
  PopulatedArticle,
  ServiceListRow,
  ServicePublicFullRow,
} from '@/app/lib/repositories/service.repo';
import type {
  ServiceLayoutNode,
  ServiceLayoutNodeInput,
  ServiceListItemDto,
  ServicePublicPageDto,
  ServiceResponseDTO,
  ServiceSectionKey,
} from '@/app/types';

const SERVICE_SECTION_KEYS: ServiceSectionKey[] = [
  'hero',
  'benefits',
  'process',
  'faq',
  'reviews',
  'cta',
];

const isServiceSectionKey = (key: string): key is ServiceSectionKey =>
  SERVICE_SECTION_KEYS.includes(key as ServiceSectionKey);

export const normalizeServiceLayout = (
  layout: ServiceLayoutNodeInput[]
): ServiceLayoutNode[] =>
  layout.map(node => {
    if (node.type === 'section') {
      if (!isServiceSectionKey(node.key)) {
        throw new Error(`Invalid service section key: ${node.key}`);
      }

      return {
        type: 'section',
        key: node.key,
        display: Boolean(node.display),
      };
    }

    return {
      type: 'group',
      key: node.key.trim(),
      display: Boolean(node.display),
      wrapperClassName: node.wrapperClassName?.trim() || undefined,
      items: Array.isArray(node.items)
        ? node.items.map(item => {
            if (!isServiceSectionKey(item.key)) {
              throw new Error(`Invalid service section key: ${item.key}`);
            }

            return {
              key: item.key,
              display: Boolean(item.display),
            };
          })
        : [],
    };
  });

type ServiceLike = {
  _id: Types.ObjectId | string;
  slug: string;
  status: ServiceResponseDTO['status'];
  title: string;
  summary: string;
  src?: unknown;
  layout: ServiceResponseDTO['layout'];
  sections: ServiceResponseDTO['sections'];
  seoTitle: string;
  seoDescription: string;
  relatedArticles?: Types.ObjectId[] | string[];
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

export const mapServiceToResponse = (
  service: ServiceLike
): ServiceResponseDTO => ({
  _id: toIdString(service._id),
  slug: service.slug,
  status: service.status,
  title: service.title,
  summary: service.summary,
  src: stringArray(service.src),
  layout: service.layout,
  sections: service.sections,
  seoTitle: service.seoTitle,
  seoDescription: service.seoDescription,
  relatedArticles: Array.isArray(service.relatedArticles)
    ? service.relatedArticles.map(toIdString)
    : [],
  publishedAt: toIsoString(service.publishedAt),
  createdAt: toIsoString(service.createdAt),
  updatedAt: toIsoString(service.updatedAt),
});

export const mapServiceResponseToPublic = (
  service: ServiceResponseDTO
): ServicePublicPageDto => ({
  id: service._id,
  slug: service.slug,
  status: service.status,
  title: service.title,
  summary: service.summary,
  src: service.src,
  layout: service.layout,
  sections: service.sections,
  seoTitle: service.seoTitle,
  seoDescription: service.seoDescription,
  relatedArticles: [],
  publishedAt: service.publishedAt,
  updatedAt: service.updatedAt,
});

export const mapServiceRowToListItem = (
  row: ServiceListRow
): ServiceListItemDto => ({
  id: row._id.toString(),
  slug: row.slug,
  title: row.title,
  summary: row.summary,
  src: firstImage(row.src),
});

export const mapPublicServiceRowToPage = (
  row: ServicePublicFullRow
): ServicePublicPageDto => ({
  id: row._id.toString(),
  slug: row.slug,
  status: row.status,
  title: row.title,
  summary: row.summary,
  src: Array.isArray(row.src) ? row.src : [],
  layout: row.layout,
  sections: row.sections,
  seoTitle: row.seoTitle,
  seoDescription: row.seoDescription,
  relatedArticles: Array.isArray(row.relatedArticles)
    ? row.relatedArticles
        .filter(
          (a): a is PopulatedArticle => typeof a === 'object' && 'slug' in a
        )
        .map(a => ({
          id: a._id.toString(),
          slug: a.slug,
          title: a.title,
          summary: a.summary,
          src: firstImage(a.src),
        }))
    : [],
  publishedAt: row.publishedAt?.toISOString(),
  updatedAt: row.updatedAt?.toISOString(),
});
