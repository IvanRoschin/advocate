import { Article } from '@/app/models';
import { CreateArticleRequestDTO, UpdateArticleDTO } from '@/app/types';

export const articleRepo = {
  /* ------------------------------------------------------------------ */
  /* FIND ALL ---------------------------------------------------------- */
  async findAll() {
    const articles = await Article.find().sort({ createdAt: -1 }).lean();

    if (!articles || articles.length === 0) {
      return [];
    }

    return articles;
  },

  /* ------------------------------------------------------------------ */
  /* FIND ALL (with populate) ----------------------------------------- */
  async findAllWithPopulate() {
    const articles = await Article.find()
      .populate('authorId')
      .populate('categoryId')
      .sort({ createdAt: -1 })
      .lean();

    return articles ?? [];
  },

  /* ------------------------------------------------------------------ */
  /* FIND BY ID -------------------------------------------------------- */
  findById(id: string) {
    return Article.findById(id);
  },

  async findByIdWithPopulate(id: string) {
    return Article.findById(id).populate('authorId').populate('categoryId');
  },

  /* ------------------------------------------------------------------ */
  /* FIND BY SLUG ------------------------------------------------------ */
  findBySlug(slug: string) {
    return Article.findOne({ slug });
  },

  findPublishedBySlug(slug: string) {
    return Article.findOne({
      slug,
      status: 'published',
    });
  },

  /* ------------------------------------------------------------------ */
  /* FIND PUBLISHED------------------------------------------------------ */

  async findPublished() {
    return Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .lean();
  },

  async findPublishedByCategory(categoryId: string) {
    return Article.find({
      status: 'published',
      categoryId,
    })
      .sort({ publishedAt: -1 })
      .lean();
  },

  /* ------------------------------------------------------------------ */
  /* CREATE ------------------------------------------------------------ */
  create(data: CreateArticleRequestDTO) {
    return Article.create(data);
  },

  /* ------------------------------------------------------------------ */
  /* UPDATE ------------------------------------------------------------ */
  update(id: string, data: UpdateArticleDTO) {
    return Article.findByIdAndUpdate(id, data, {
      new: true,
    });
  },

  /* ------------------------------------------------------------------ */
  /* DELETE ------------------------------------------------------------ */
  delete(id: string) {
    return Article.findByIdAndDelete(id);
  },

  async findPublicList(limit = 24) {
    return Article.find({ status: 'published' })
      .select('_id slug title summary tags src publishedAt categoryId') // ✅ только то, что нужно для превью
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate({
        path: 'categoryId',
        select: '_id title slug',
      })
      .lean();
  },
};
