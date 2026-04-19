import Link from 'next/link';

import { Btn } from '@/components';
import { ArticlePageDto } from './article.sections';

type Props = {
  article: ArticlePageDto;
};

export default function ArticleServiceLink({ article }: Props) {
  if (!article.service) return null;

  return (
    <section className="container py-10 lg:py-14">
      <div className="border-border bg-card rounded-3xl border p-6 lg:p-8">
        <div className="max-w-2xl">
          {/* label */}
          <div className="text-muted-foreground text-sm">Пов’язана послуга</div>

          {/* title */}
          <h2 className="title-app text-accent mt-2 text-2xl font-semibold lg:text-3xl">
            {article.service.title}
          </h2>

          {/* description (опционально можно позже добавить в DTO) */}
          <p className="text-app mt-4 text-base leading-7">
            Отримайте професійну допомогу за цією темою. Ми супроводимо вас на
            кожному етапі.
          </p>

          {/* CTA */}
          <div className="mt-6">
            <Link href={`/services/${article.service.slug}`}>
              <Btn label="Перейти до послуги" uiVariant="accent" radius={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
