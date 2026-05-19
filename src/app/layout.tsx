import './styles/globals.css';

import Script from 'next/script';

import {
  eUkraine,
  eUkrainehead,
  geistMono,
  geistSans,
  manrope,
  sacramento,
} from '@/app/ui/fonts';

import { Providers } from './providers/providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={` ${geistSans.variable} ${geistMono.variable} ${eUkrainehead.variable} ${eUkraine.variable} ${manrope.variable} ${sacramento.variable} `}
    >
      <body>
        <Providers>{children}</Providers>

        {/* Cloudinary */}
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
