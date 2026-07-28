import mongoose, { InferSchemaType, Types } from 'mongoose';

import { LayoutNodeSchema } from './layoutNode.schema';

const { Schema } = mongoose;

const ServiceSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },

    title: { type: String, required: true, trim: true },

    summary: { type: String, required: true, maxlength: 500 },

    src: {
      type: [String],
      required: true,
      default: [],
    },

    layout: {
      type: [LayoutNodeSchema],
      required: true,
      default: [],
    },

    sections: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },

    seoTitle: {
      type: String,
      required: true,
      trim: true,
    },

    seoDescription: {
      type: String,
      required: true,
      trim: true,
    },

    relatedArticles: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
      default: [],
    },

    publishedAt: { type: Date, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ServiceSchema.index({ status: 1, publishedAt: -1 });
ServiceSchema.index({ title: 'text', summary: 'text', seoTitle: 'text' });

ServiceSchema.virtual('isPublished').get(function () {
  return this.status === 'published' && !!this.publishedAt;
});

ServiceSchema.pre('save', function () {
  if (
    this.isModified('status') &&
    this.status === 'published' &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

type ServiceInput = InferSchemaType<typeof ServiceSchema>;

type ServiceDocument = ServiceInput & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export default mongoose.models.Service ||
  mongoose.model<ServiceDocument>('Service', ServiceSchema);
