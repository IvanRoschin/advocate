'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import Btn from '@/app/ui/button/Btn';

const data = {
  uptitle: 'Адвокатська допомога • Захист інтересів • Результат',
  title: 'Адвокат у складних правових ситуаціях',
  name: 'Рощин Іван Геннадійович',
  subtitle:
    'Захищаю ваші права, мінімізую ризики та доводжу справи до результату. Конфіденційно. Професійно. Законно.',
};

const Hero = () => {
  const [phone, setPhone] = useState<string | null>(null);

  // Подставляем номер на клиенте
  useEffect(() => {
    if (process.env.ADVOCATE_PN_1) {
      setPhone(process.env.ADVOCATE_PN_1);
    }
  }, []);
  return (
    <section
      className="relative flex min-h-screen w-full items-center overflow-hidden"
      itemScope
      itemType="https://schema.org/LegalService"
    >
      {/* Фоновое изображение */}
      <Image
        src="/hero_bg.webp"
        alt="Hero background"
        fill
        priority
        className="-z-20 object-cover"
      />

      {/* Градиентный оверлей */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/60 via-black/30 to-black/60" />

      {/* Контент Hero */}
      <div className="relative z-10 container px-4 text-white">
        <p className="mb-6 text-xs tracking-widest text-gray-300 uppercase md:text-sm">
          {data.uptitle}
        </p>

        <div className="after:bg-accent relative mb-6 after:block after:h-px after:w-40 after:content-['']" />

        <h1 className="mb-4 text-3xl leading-tight font-bold md:text-5xl">
          {data.title}
          <br />
          <span className="font-eukrainehead group text-accent relative mt-2 inline-block text-2xl font-bold md:text-4xl">
            {data.name}
            <span className="bg-accent absolute -bottom-1 left-0 h-0.75 w-0 transition-all duration-500 group-hover:w-full"></span>
          </span>
        </h1>

        <p className="mt-6 mb-8 max-w-xl text-base text-gray-200 md:text-lg">
          {data.subtitle}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Btn title="Отримати консультацію" />

          {phone && (
            <Btn
              title={`Зателефонувати зараз ${phone}`}
              component="a"
              href={`tel:${phone}`}
              uiVariant="outline"
            />
          )}
        </div>

        <p className="app-text mt-6 text-xs">
          Первинна консультація • Адвокатська таємниця гарантована
        </p>
      </div>
    </section>
  );
};

export default Hero;
