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

// Виставляє клас .dark на <html> синхронно, до першої відмальовки й до
// гідратації React. Без цього тема застосовувалась лише в useEffect
// (ThemeStoreProvider), і при кожному завантаженні сторінки на долю секунди
// був видний "не той" варіант теми (flash of incorrect theme) — особливо
// помітно для користувачів, що зберегли світлу тему, бо дефолт стора 'dark'.
// Ключ і дефолт свідомо продубльовані з app/store/theme.store.ts.
const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
