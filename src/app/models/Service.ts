import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

const ServiceLayoutItemSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    display: { type: Boolean, required: true, default: true },
  },
  { _id: false }
);

const ServiceLayoutNodeSchema = new Schema(
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
      type: [ServiceLayoutItemSchema],
      default: undefined,
    },
  },
  { _id: false }
);

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
      type: [ServiceLayoutNodeSchema],
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

export type ServiceInput = InferSchemaType<typeof ServiceSchema>;

export type ServiceDocument = ServiceInput & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export default mongoose.models.Service ||
  mongoose.model<ServiceDocument>('Service', ServiceSchema);
