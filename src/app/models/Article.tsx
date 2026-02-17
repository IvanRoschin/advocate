import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

const CoverImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

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

    // summary/excerpt — синхронизируемся с DTO (у тебя было summary)
    summary: { type: String, required: true, maxlength: 500 },

    content: { type: String, required: true },

    // Автор из БД (обязательный)
    authorId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Категория из БД (1 категория на статью, легче для UI/фильтра)
    categoryId: {
      type: Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },

    tags: { type: [String], default: [], index: true },

    coverImage: { type: CoverImageSchema },

    publishedAt: { type: Date, index: true },

    // если надо — оставь язык, иначе можно убрать
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

// Листинг опубликованных
ArticleSchema.index({ status: 1, publishedAt: -1 });

// По категории
ArticleSchema.index({ categoryId: 1, publishedAt: -1 });

// По автору
ArticleSchema.index({ authorId: 1, createdAt: -1 });

// Простой full-text
ArticleSchema.index(
  { title: 'text', summary: 'text', content: 'text' },
  { name: 'ArticleTextIndex' }
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
