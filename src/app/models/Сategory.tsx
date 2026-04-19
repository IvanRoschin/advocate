import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    icon: {
      type: String,
      required: false,
      default: 'civil',
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

categorySchema.index({ '$**': 'text' });

export default mongoose.models.Category ||
  mongoose.model('Category', categorySchema);
