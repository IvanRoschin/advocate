import { homeLayout } from '@/app/resources/content/pages/home.layout';
import { home, person } from './resources/content';
import { buildOgImageUrl, generateMetadata } from './helpers';
import { HOME_SECTIONS, HomeSectionProps } from './home.sections';
import { renderLayout } from './lib/layouts/renderLayout';
import { reviewService } from './lib/services/review.service';

export const metadata = generateMetadata({
  title: home.title,
  description: home.description,
  path: home.path,
  imageUrl: buildOgImageUrl({
    title: home.title,
    subtitle: `${person.role} • ${person.location}`,
    tag: 'Головна',
  }),
});

export default async function Home() {
  const reviews = await reviewService.getApprovedByTarget({
    targetType: 'page',
    pageKey: 'home',
    limit: 4,
  });

  const sectionProps: HomeSectionProps = {
    reviews,
  };

  return (
    <main className="relative">
      {renderLayout({
        layout: homeLayout,
        sections: HOME_SECTIONS,
        sectionProps,
      })}
    </main>
  );
}
