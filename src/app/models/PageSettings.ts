import mongoose, { InferSchemaType } from 'mongoose';

const { Schema } = mongoose;

const LayoutItemSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    display: { type: Boolean, required: true, default: true },
  },
  { _id: false }
);

const LayoutNodeSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['section', 'group'],
      required: true,
    },
    key: { type: String, required: true, trim: true },
    display: { type: Boolean, required: true, default: true },
    wrapperClassName: { type: String, trim: true },
    items: {
      type: [LayoutItemSchema],
      default: undefined,
    },
  },
  { _id: false }
);

const PageSettingsSchema = new Schema(
  {
    entity: {
      type: String,
      required: true,
      unique: true,
      enum: ['article', 'service'],
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

export type PageSettingsInput = InferSchemaType<typeof PageSettingsSchema>;

export default mongoose.models.PageSettings ||
  mongoose.model('PageSettings', PageSettingsSchema);
