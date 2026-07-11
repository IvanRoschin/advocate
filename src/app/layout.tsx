import {
  eUkraine,
  eUkrainehead,
  geistMono,
  geistSans,
  manrope,
  sacramento,
} from '@/app/ui/fonts';
import { Providers } from './providers/providers';

import './styles/globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={` ${geistSans.variable} ${geistMono.variable} ${eUkrainehead.variable} ${eUkraine.variable} ${manrope.variable} ${sacramento.variable} `}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
