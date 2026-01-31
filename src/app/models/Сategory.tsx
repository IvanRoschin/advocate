import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

// Схема категории
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
    },
    src: {
      type: [String],
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// Полнотекстовый индекс
categorySchema.index({ '$**': 'text' });

// Тип для входных данных
export type CategoryInput = InferSchemaType<typeof categorySchema> & {
  _id: Types.ObjectId;
};
// Тип документа Mongo
export type CategoryDocument = CategoryInput & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

// Экспорт модели
export default mongoose.models.Category ||
  mongoose.model<CategoryDocument>('Category', categorySchema);
