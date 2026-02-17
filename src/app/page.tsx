import { homeLayout } from '@/app/resources/content/pages/home.layout';

import { generateMetadata } from './helpers/generateMetadata';
import { HOME_SECTIONS } from './home.sections';
import { home } from './resources/content';

export const metadata = generateMetadata({
  title: home.title,
  description: home.description,
  url: home.path,
  imageUrl: home.image,
});

export default function Home() {
  return (
    <main className="relative">
      {homeLayout
        .filter(node => node.display)
        .map(node => {
          if (node.type === 'section') {
            const Section = HOME_SECTIONS[node.key];
            return <Section key={node.key} />;
          }

          // group
          return (
            <div key={node.key} className={node.wrapperClassName}>
              {node.items
                .filter(it => it.display)
                .map(it => {
                  const Section = HOME_SECTIONS[it.key];
                  return <Section key={it.key} />;
                })}
            </div>
          );
        })}
    </main>
  );
}
