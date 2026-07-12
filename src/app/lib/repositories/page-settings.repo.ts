import PageSettings from '@/app/models/PageSettings';

import type {
  PageSettingsResponseDTO,
  UpdatePageSettingsDTO,
} from '@/app/types';

export const pageSettingsRepo = {
  findByEntity(entity: PageSettingsResponseDTO['entity']) {
    return PageSettings.findOne({ entity }).lean();
  },

  async upsertByEntity(data: UpdatePageSettingsDTO) {
    return PageSettings.findOneAndUpdate(
      { entity: data.entity },
      { $set: { layout: data.layout } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();
  },
};
