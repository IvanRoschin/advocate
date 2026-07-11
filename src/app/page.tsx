import { pageSettingsActions } from './actions/page-settings.actions';
import { reviewPublicActions } from './actions/review.actions';
import { slidePublicActions } from './actions/slide.actions';
import { buildOgImageUrl, generateMetadata } from './helpers';
import { HOME_SECTIONS, HomeSectionProps } from './home.sections';
import { LayoutNode, renderLayout } from './lib/layouts/renderLayout';
import { home, person } from './resources/content';
import { HomeSectionKey } from './resources/content/pages/home.layout';

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
  const reviewsRaw = await reviewPublicActions.list({
    targetType: 'page',
    pageKey: 'home',
    limit: 4,
  });
  const reviews = reviewsRaw.items;

  const slides = await slidePublicActions.active();

  const sectionProps: HomeSectionProps = {
    reviews,
    slides,
  };
  const layout = (await pageSettingsActions.getLayout(
    'home'
  )) as LayoutNode<HomeSectionKey>[];

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
