import { Geist, Geist_Mono, Sacramento } from 'next/font/google';
import localFont from 'next/font/local';

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const sacramento = Sacramento({
  variable: '--font-sacramento',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const eUkrainehead = localFont({
  src: [
    {
      path: './e-Ukraine Head/e-UkraineHead-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-eukrainehead',
  display: 'swap',
});

export const eUkraine = localFont({
  src: [
    { path: './e-Ukraine/e-Ukraine-Thin.woff2', weight: '100', style: 'normal' },
    {
      path: './e-Ukraine/e-Ukraine-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    { path: './e-Ukraine/e-Ukraine-Light.woff2', weight: '300', style: 'normal' },
    {
      path: './e-Ukraine/e-Ukraine-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './e-Ukraine/e-Ukraine-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    { path: './e-Ukraine/e-Ukraine-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-eukraine',
  display: 'swap',
});

export const manrope = localFont({
  src: './Manrope-Regular.woff',
  variable: '--font-manrope',
  weight: '100 900',
  display: 'swap',
});
