import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

const ArticleSchema = new Schema(
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
    subtitle: { type: String, trim: true },

    summary: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },

    authorId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    categoryId: {
      type: Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    src: {
      type: [String],
      required: true,
      default: [],
    },

    publishedAt: { type: Date, index: true },

    language: {
      type: String,
      enum: ['uk', 'ru', 'en'],
      default: 'uk',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ categoryId: 1, publishedAt: -1 });
ArticleSchema.index({ authorId: 1, createdAt: -1 });

ArticleSchema.index(
  { title: 'text', summary: 'text', content: 'text' },
  {
    name: 'ArticleTextIndex',
    default_language: 'none',
    language_override: '__lang',
  }
);

ArticleSchema.virtual('isPublished').get(function () {
  return this.status === 'published' && !!this.publishedAt;
});

ArticleSchema.pre('save', function () {
  if (
    this.isModified('status') &&
    this.status === 'published' &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

export type ArticleInput = InferSchemaType<typeof ArticleSchema>;

export type ArticleDocument = ArticleInput & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export default mongoose.models.Article ||
  mongoose.model<ArticleDocument>('Article', ArticleSchema);
