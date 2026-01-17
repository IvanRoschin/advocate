import Script from 'next/script';

import {
  eUkraine,
  eUkrainehead,
  geistMono,
  geistSans,
  manrope,
  sacramento,
} from '@/app/ui/fonts';
import ToastProvider from './providers/ToastProvider';

import '@/app/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} ${eUkrainehead.variable} ${manrope.variable} ${eUkraine.variable} ${sacramento.variable} antialiased`}
    >
      <body className="font-manrope">
        {/* Google reCAPTCHA */}
        <Script
          src={`https://www.google.com/recaptcha/api.js`}
          strategy="afterInteractive"
        />
        {children} <ToastProvider />
      </body>
    </html>
  );
}
