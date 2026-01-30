import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

// Схема подписчика
const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subscribed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // автоматически добавляет createdAt и updatedAt
  }
);

// Опционально: полнотекстовый индекс, если нужно искать по email
subscriberSchema.index({ '$**': 'text' });

// Типы TypeScript
export type SubscriberInput = InferSchemaType<typeof subscriberSchema>;

export type SubscriberDocument = SubscriberInput & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

// Экспорт модели
export default mongoose.models.Subscriber ||
  mongoose.model<SubscriberDocument>('Subscriber', subscriberSchema);
