import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

/* ------------------------------------------------------------------ */
/* Media */
/* ------------------------------------------------------------------ */

const CoverImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    dominantColor: { type: String },
  },
  { _id: false }
);

/* ------------------------------------------------------------------ */
/* SEO */
/* ------------------------------------------------------------------ */

const SeoSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    canonicalUrl: { type: String },
    noIndex: { type: Boolean, default: false },
    openGraph: {
      title: { type: String },
      description: { type: String },
      image: { type: String },
    },
  },
  { _id: false }
);

/* ------------------------------------------------------------------ */
/* Article */
/* ------------------------------------------------------------------ */

const ArticleSchema = new Schema(
  {
    /* identity */
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },

    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public',
      index: true,
    },

    /* content */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      maxlength: 500,
    },

    content: {
      type: String,
      required: true,
    },

    readingTime: {
      type: Number,
      required: true,
      min: 1,
    },

    language: {
      type: String,
      enum: ['uk', 'ru', 'en'],
      default: 'uk',
      index: true,
    },

    /* authoring */
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    coAuthors: [{ type: Types.ObjectId, ref: 'User' }],

    /* media */
    coverImage: {
      type: CoverImageSchema,
    },

    /* taxonomy */
    tags: {
      type: [String],
      default: [],
      index: true,
    },

    categories: [
      {
        type: Types.ObjectId,
        ref: 'Category',
        index: true,
      },
    ],

    /* interactions */
    comments: [{ type: Types.ObjectId, ref: 'Comment' }],

    commentsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0, index: true },
    viewsCount: { type: Number, default: 0, index: true },

    /* seo */
    seo: SeoSchema,

    /* publishing */
    publishedAt: {
      type: Date,
      index: true,
    },

    /* editorial */
    featured: { type: Boolean, default: false, index: true },
    pinned: { type: Boolean, default: false, index: true },

    source: { type: String },

    revision: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ------------------------------------------------------------------ */
/* Indexes */
/* ------------------------------------------------------------------ */

// Основные публичные листинги
ArticleSchema.index({
  status: 1,
  visibility: 1,
  publishedAt: -1,
});

// Автор + дата
ArticleSchema.index({
  author: 1,
  createdAt: -1,
});

// Главная / featured
ArticleSchema.index({
  featured: 1,
  pinned: 1,
  publishedAt: -1,
});

// Full-text search
ArticleSchema.index(
  {
    title: 'text',
    excerpt: 'text',
    content: 'text',
  },
  {
    weights: {
      title: 5,
      excerpt: 3,
      content: 1,
    },
    name: 'ArticleTextIndex',
  }
);

/* ------------------------------------------------------------------ */
/* Virtuals */
/* ------------------------------------------------------------------ */

ArticleSchema.virtual('isPublished').get(function () {
  return this.status === 'published' && !!this.publishedAt;
});

/* ------------------------------------------------------------------ */
/* Hooks */
/* ------------------------------------------------------------------ */

// Автоматически проставлять дату публикации
ArticleSchema.pre('save', function () {
  if (
    this.isModified('status') &&
    this.status === 'published' &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type ArticleInput = InferSchemaType<typeof ArticleSchema>;

export type ArticleDocument = ArticleInput & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

/* ------------------------------------------------------------------ */
/* Model */
/* ------------------------------------------------------------------ */

export default mongoose.models.Article ||
  mongoose.model<ArticleDocument>('Article', ArticleSchema);
