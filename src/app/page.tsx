import { buildOgImageUrl, generateMetadata } from './helpers';
import { HOME_SECTIONS, HomeSectionProps } from './home.sections';
import { renderLayout } from './lib/layouts/renderLayout';
import { pageSettingsService } from './lib/services/page-settings.service';
import { reviewService } from './lib/services/review.service';
import { slideService } from './lib/services/slide.service';
import { home, person } from './resources/content';

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

  const slides = await slideService.getActiveSlides();

  const sectionProps: HomeSectionProps = {
    reviews,
    slides,
  };
  const layout = await pageSettingsService.getHomeLayout();

  return (
    <main className="relative">
      {renderLayout({
        layout,
        sections: HOME_SECTIONS,
        sectionProps,
      })}
    </main>
  );
}
