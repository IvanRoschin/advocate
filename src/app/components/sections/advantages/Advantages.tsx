'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import Btn from '@/app/ui/button/Btn';

import AdvantageItem from './AdvantageItem';

const Advantages = () => {
  const [phone, setPhone] = useState<string | null>(null);

  // Подставляем номер на клиенте
  useEffect(() => {
    if (process.env.ADVOCATE_PN_1) {
      setPhone(process.env.ADVOCATE_PN_1);
    }
  }, []);

  return (
    <section
      className="relative flex min-h-screen items-center py-20 text-white"
      itemScope
      itemType="https://schema.org/LegalService"
    >
      {/* Background */}
      <Image
        src="/advantages_bg_v1.webp"
        alt="Юридичні послуги адвоката"
        fill
        priority
        className="-z-20 object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/70 via-black/40 to-black/80" />

      <div className="relative z-10 container grid gap-16 px-4 lg:grid-cols-2">
        {/* LEFT — Advantages */}
        <div>
          <p className="text-accent mb-4 text-sm tracking-widest uppercase">
            Чому обирають мене
          </p>

          <h2 className="font-eukrainehead mb-10 text-3xl leading-tight font-bold md:text-4xl">
            Результат, відповідальність <br />
            <span className="text-accent">та повна конфіденційність</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <AdvantageItem
              value={100}
              suffix="%"
              text="Гарантія адвокатської конфіденційності"
            />
            <AdvantageItem
              value={10}
              suffix="+"
              text="Років практичного юридичного досвіду"
            />
            <AdvantageItem
              value={24}
              suffix="/7"
              text="Постійний звʼязок з клієнтом"
            />
            <AdvantageItem
              value={5}
              suffix="+"
              text="Ключових юридичних практик"
            />
          </div>
        </div>

        {/* RIGHT — Call to Action */}
        <div className="flex flex-col justify-center rounded-3xl bg-black/50 p-8 backdrop-blur-md">
          <h3 className="font-eukrainehead mb-4 text-2xl font-bold">
            Потрібна юридична допомога?
          </h3>
          <p className="mb-6 text-gray-200">
            Отримайте <strong>первинну консультацію</strong> та зрозумійте
            реальні перспективи вашої справи вже сьогодні.
          </p>
          {/* Кнопка рендерится только на клиенте */}
          {phone && (
            <Btn
              title={`Зателефонувати адвокату ${phone}`}
              component="a"
              href={`tel:${phone}`}
              uiVariant="accent"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
