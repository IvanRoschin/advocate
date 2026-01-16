import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import {
  About,
  Advantages,
  Hero,
  Order,
  Practices,
  Reviews,
  WhyChooseMe,
} from './components/sections';
import Services from './components/services/Services';
import Socials from './components/socials/Socials';
import { generateMetadata } from './helpers/generate-metadata';
import ScrollToTopButton from './ui/button/ScrollToTopButton';

export const metadata = generateMetadata({
  title: 'Головна | Адвокат Іван Рощин',
  description:
    'Головна сторінка Адвокат Іван Рощин – професійна правнича допомога у цивільних, господарських та адміністративних справах.',
  url: process.env.PUBLIC_URL,
  imageUrl: '/ivan_roschin.webp',
});

export default function Home() {
  return (
    <main className="relative">
      <p className="font-sans">Geist Sans</p>
      <p className="font-eukrainehead">e-Ukraine Head</p>
      <p className="font-eukraine">e-Ukraine</p>
      <p className="font-manrope">Manrope</p>
      <p className="font-sacramento">Sacramento</p>
      <Socials />
      <Header />
      {/* Секция Hero */}
      <div className="relative">
        <Hero />
        {/* Services поверх Hero и About */}
        <Services />
      </div>
      {/* Секция About */}
      <About />
      {/* Секция Practices */}
      <Practices />
      {/* Секция Advantages */}
      <Advantages />
      {/* Секция Reviews */}
      <Reviews />
      {/* Секция WhyChooseMe */}
      <WhyChooseMe />
      {/* Секция Order */}
      <Order />

      <Footer />

      <ScrollToTopButton />
    </main>
  );
}
