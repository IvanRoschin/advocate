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
      path: './e-Ukraine Head/e-UkraineHead-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-UltraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './e-Ukraine Head/e-UkraineHead-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-eukrainehead',
  display: 'swap',
});

// Декоративне лого-начертання — окремий варіант, не «вага» в звичайному сенсі
export const eUkrainaheadLogo = localFont({
  src: './e-Ukraine Head/e-UkraineHead-LOGO.otf',
  variable: '--font-eukrainehead-logo',
  weight: '500',
  display: 'swap',
});

export const eUkraine = localFont({
  src: [
    { path: './e-Ukraine/e-Ukraine-Thin.otf', weight: '100', style: 'normal' },
    {
      path: './e-Ukraine/e-Ukraine-UltraLight.otf',
      weight: '200',
      style: 'normal',
    },
    { path: './e-Ukraine/e-Ukraine-Light.otf', weight: '300', style: 'normal' },
    {
      path: './e-Ukraine/e-Ukraine-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './e-Ukraine/e-Ukraine-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    { path: './e-Ukraine/e-Ukraine-Bold.otf', weight: '700', style: 'normal' },
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
