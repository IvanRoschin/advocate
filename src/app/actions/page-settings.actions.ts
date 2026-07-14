import { pageSettingsRepo } from '@/app/lib/repositories/page-settings.repo';
import type {
  PageLayoutNode,
  PageSettingsEntity,
  PageSettingsResponseDTO,
  UpdatePageSettingsDTO,
} from '@/app/types';
import { defaultLayouts } from '../resources/content/pages';
import { createAction } from './createAction';
export const pageSettingsActions = {
  getLayout: createAction<
    PageSettingsEntity,
    PageSettingsResponseDTO['layout'] | null
  >(
    async ({ args: entity }) => {
      const settings = await pageSettingsRepo.findByEntity(entity);

      return (
        settings?.layout ?? (defaultLayouts[entity] as PageLayoutNode[]) ?? []
      );
    },
    { buildFallback: [] }
  ),

  updateLayout: createAction<
    Omit<UpdatePageSettingsDTO, 'entity'>,
    Awaited<ReturnType<typeof pageSettingsRepo.upsertByEntity>>
  >(async ({ args }) => {
    return pageSettingsRepo.upsertByEntity({
      entity: 'service',
      layout: args.layout,
    });
  }),
};
