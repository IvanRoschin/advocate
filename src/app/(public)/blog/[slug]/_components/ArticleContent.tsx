export default function ArticleContent({ html }: { html: string }) {
  return (
    <article
      data-article
      className="prose prose-neutral prose-h2:scroll-mt-24 prose-h3:scroll-mt-24 article-content max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
