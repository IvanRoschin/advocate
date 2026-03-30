import PageSettings from '@/app/models/PageSettings';
import type { UpdatePageSettingsDTO } from '@/app/types';

export const pageSettingsRepo = {
  findByEntity(entity: UpdatePageSettingsDTO['entity']) {
    return PageSettings.findOne({ entity });
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
    );
  },
};
