import mongoose, { Types } from 'mongoose';

const { Schema } = mongoose;

const testimonialSchema = new Schema(
  {
    article: {
      type: Types.ObjectId,
      ref: 'Article',
      required: false, // можно true, если отзыв всегда к товару
    },
    author: {
      type: String, // Имя автора
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
);

/* ------------------ */
/* Индексы */
/* ------------------ */

// Полнотекстовый поиск по тексту отзыва и имени автора
testimonialSchema.index({ text: 'text', author: 'text' });

// Для фильтрации активных и рейтинговых
testimonialSchema.index({ isActive: 1, rating: -1 });

/* ------------------ */
/* Модель */
/* ------------------ */
export type TestimonialDocument = mongoose.InferSchemaType<
  typeof testimonialSchema
> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export default mongoose.models.Testimonial ||
  mongoose.model<TestimonialDocument>('Testimonial', testimonialSchema);
