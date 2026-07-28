import mongoose from 'mongoose';

const { Schema } = mongoose;

const LayoutItemSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    display: { type: Boolean, required: true, default: true },
  },
  { _id: false }
);

/**
 * Shared page-layout sub-schema — used by both PageSettings (per-page
 * layout config) and Service (per-service layout override). Kept as one
 * schema so the two don't silently drift apart.
 */
export const LayoutNodeSchema = new Schema(
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
