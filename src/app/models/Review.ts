import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    authorName: {
      type: String,
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
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      required: true,
      default: 'pending',
      index: true,
    },

    targetType: {
      type: String,
      enum: ['service', 'article', 'page'],
      required: true,
      index: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      required: false,
      index: true,
    },

    pageKey: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ReviewSchema.index({ targetType: 1, targetId: 1, status: 1 });
ReviewSchema.index({ targetType: 1, pageKey: 1, status: 1 });

export type ReviewInput = InferSchemaType<typeof ReviewSchema>;

export type ReviewDocument = ReviewInput & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export default mongoose.models.Review ||
  mongoose.model<ReviewDocument>('Review', ReviewSchema);
