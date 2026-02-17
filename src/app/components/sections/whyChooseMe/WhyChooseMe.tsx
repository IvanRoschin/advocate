'use client';

import Image from 'next/image';
import { useCallback, useId, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { whyChooseMeSection } from '@/app/resources';

const WhyChooseMe = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const uid = useId();

  const toggle = useCallback((id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  }, []);

  const { header, image, items, lead, id, schemaType } = whyChooseMeSection;

  return (
    <section
      id={id}
      className="bg-[#1b1e27] py-20 sm:py-28 md:py-36"
      itemScope
      itemType={schemaType}
    >
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center sm:mb-16 md:mb-20">
          <span className="bg-accent mb-4 inline-block h-8 w-px" />
          <p className="text-accent text-xs tracking-widest uppercase">
            {header.uptitle}
          </p>
          <h2 className="font-eukrainehead mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {header.title}
          </h2>
          <span className="bg-accent mt-4 inline-block h-8 w-px" />
        </header>

        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
          {/* Фото */}
          <div className="relative h-75 w-full max-w-125 overflow-hidden rounded-2xl shadow-lg sm:h-87.5 md:h-100 md:max-w-150 lg:h-112.5 lg:max-w-175">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              itemProp="image"
              priority={false}
            />
            <meta itemProp="name" content={image.personName} />
            <meta itemProp="jobTitle" content={image.jobTitle} />
          </div>

          {/* Accordion */}
          <div className="w-full flex-1 space-y-4">
            <h3 className="font-eukrainehead text-lg font-semibold text-white sm:text-xl md:text-2xl">
              {lead.line1.split(lead.accentWords[0]).map((chunk, idx) =>
                idx === 0 ? (
                  <span key={idx}>
                    {chunk}
                    <span className="text-accent">{lead.accentWords[0]}</span>
                  </span>
                ) : (
                  chunk
                )
              )}
              <br />
              <span className="text-accent">{lead.accentWords[1]}</span>
              {lead.line2.replace(lead.accentWords[1], '')}
            </h3>

            {items.map(item => {
              const isOpen = openId === item.id;
              const panelId = `${uid}-panel-${item.id}`;
              const buttonId = `${uid}-btn-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/20 transition-all duration-300"
                >
                  <button
                    id={buttonId}
                    type="button"
                    className="hover:text-accent flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-white transition-colors md:text-lg"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                  >
                    {item.title}
                    <span className="ml-3" aria-hidden>
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`overflow-hidden px-5 transition-all duration-300 ${
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
