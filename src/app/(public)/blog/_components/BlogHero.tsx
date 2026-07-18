import { blog } from '@/app/resources/content';

const BlogHero = () => (
  <section className="container pt-10 lg:pt-14">
    <div className="mb-8 max-w-3xl">
      <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
        {blog.eyebrow}
      </p>
      <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-4xl">
        {blog.heading}
      </h1>
      <p className="text-app mt-4 text-base leading-7">{blog.lead}</p>
    </div>
  </section>
);

export default BlogHero;
