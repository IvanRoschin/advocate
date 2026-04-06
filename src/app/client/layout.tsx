import { renderLayout } from '../lib/layouts/renderLayout';
import { clientLayout } from '../resources/content/pages/client.layout';
import {
  CLIENT_SECTIONS,
  ClientSectionProps,
} from './_components/client.sections';

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sectionProps: ClientSectionProps = {
    children,
  };
  return (
    <main className="bg-app relative min-h-screen">
      {renderLayout({
        layout: clientLayout,
        sections: CLIENT_SECTIONS,
        sectionProps,
      })}
    </main>
  );
}
