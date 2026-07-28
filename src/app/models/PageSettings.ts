import mongoose from 'mongoose';

import { LayoutNodeSchema } from './layoutNode.schema';

const { Schema } = mongoose;

const PageSettingsSchema = new Schema(
  {
    entity: {
      type: String,
      required: true,
      unique: true,
      enum: ['article', 'service', 'home'],
      index: true,
    },

    layout: {
      type: [LayoutNodeSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.PageSettings ||
  mongoose.model('PageSettings', PageSettingsSchema);
