'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const whyChooseMe = [
  {
    title: 'Працюю на результат',
    content: 'Кожна справа доводиться до реального результату для клієнта.',
  },
  {
    title: 'Кваліфікований підхід',
    content:
      'Поглиблений аналіз справи та індивідуальні рішення для кожного клієнта.',
  },
  {
    title: 'Оперативність',
    content: 'Швидке реагування на запити та ефективне вирішення завдань.',
  },
  {
    title: 'Уважність до деталей',
    content:
      'Нічого не проходить повз увагу, жодна деталь не залишиться без контролю.',
  },
];

const WhyChooseMe = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="why-choose-me"
      className="bg-[#1b1e27] py-20 sm:py-28 md:py-36"
      itemScope
      itemType="https://schema.org/ProfessionalService"
    >
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <header className="mb-12 text-center sm:mb-16 md:mb-20">
          <span className="bg-accent mb-4 inline-block h-8 w-px" />
          <p className="text-accent text-xs tracking-widest uppercase">
            Чому обирають мене
          </p>
          <h2 className="font-eukrainehead mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Професіоналізм, надійність, результат <br />
            та індивідуальний підхід
          </h2>
          <span className="bg-accent mt-4 inline-block h-8 w-px" />
        </header>

        {/* Контент: изображение + аккордеон */}
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
          {/* Фото */}
          <div className="relative h-75 w-full max-w-125 overflow-hidden rounded-2xl shadow-lg sm:h-87.5 md:h-100 md:max-w-150 lg:h-112.5 lg:max-w-175">
            <Image
              src="/ivan_roschin_wcm_section.webp"
              alt="Адвокат Рощин Іван Геннадійович"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              itemProp="image"
            />
            <meta itemProp="name" content="Іван Рощин" />
            <meta itemProp="jobTitle" content="Адвокат" />
          </div>

          {/* Accordion */}
          <div className="w-full flex-1 space-y-4">
            {/* Большой текст про победу/опыт */}
            <h3 className="font-eukrainehead text-lg font-semibold text-white sm:text-xl md:text-2xl">
              Я ніколи <span className="text-accent">не програю</span>
              <br />
              <span className="text-accent">Або я переміг,</span> або чомусь
              навчився
            </h3>

            {whyChooseMe.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-black/20 transition-all duration-1200"
                >
                  <button
                    className="hover:text-accent flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-white transition-colors md:text-lg"
                    onClick={() => toggle(i)}
                  >
                    {item.title}
                    <span className="ml-3">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden px-5 transition-all duration-1200 ${
                      isOpen ? 'max-h-96 py-2 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-app text-sm md:text-base">
                      {item.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMe;
