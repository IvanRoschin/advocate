import { aboutSection } from '@/app/resources';
import { AppLink, NextImage } from '@/components';
import { person, social } from '@/resources/content';

const About = () => {
  const phones = social
    .filter(s => s.icon === 'phone' && Boolean(s.link))
    .map(s => s.link) // "tel:095..."
    .filter(
      (href): href is string =>
        typeof href === 'string' && href.startsWith('tel:')
    );

  return (
    <section
      id={aboutSection.id}
      className="bg-[#21242b] pt-120 sm:pt-100 md:py-60 lg:pt-40"
      itemScope
      itemType={aboutSection.schemaType}
    >
      <div className="font-eukraine container">
        {/* Header */}
        <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <span className="bg-accent mb-4 h-8 w-px" />
          <p className="text-xs tracking-widest text-white uppercase">
            {aboutSection.header.uptitle}
          </p>
          <h2 className="font-eukrainehead mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {aboutSection.header.title}
          </h2>
          <span className="bg-accent mt-4 h-8 w-px" />
        </header>

        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-0 lg:mt-30">
          {/* Image */}
          <div
            className="relative h-105 w-full max-w-70 shadow-lg sm:h-140 sm:max-w-90 md:-mt-24 lg:-mt-48"
            itemScope
            itemType="https://schema.org/Person"
          >
            <NextImage
              useSkeleton
              src={aboutSection.image.src}
              alt={aboutSection.image.alt}
              fill
              sizes={aboutSection.image.sizes}
              className="object-cover"
              itemProp="image"
            />
            <meta itemProp="name" content={person.name} />
            <meta itemProp="jobTitle" content={person.role} />
          </div>

          {/* Text */}
          <div className="bg-app text-app w-full max-w-90 space-y-4 p-6 text-sm text-black sm:p-8 sm:text-base md:max-w-[50%] md:p-14">
            <h3 className="font-eukrainehead text-lg font-semibold text-black sm:text-xl">
              {aboutSection.lead.titleParts.a}
              <span className="text-accent">
                {aboutSection.lead.titleParts.accent1}
              </span>
              {aboutSection.lead.titleParts.b}
              <br />
              <span className="text-accent">
                {aboutSection.lead.titleParts.accent2}
              </span>
            </h3>

            <p itemProp="description">
              {aboutSection.paragraphs[0].replace('10 років', '')}
              <strong>10 років</strong>.
              {aboutSection.paragraphs[0].split('10 років.')[1] ?? ''}
            </p>

            <p>{aboutSection.paragraphs[1]}</p>

            <ul className="list-disc space-y-1 pl-5">
              {aboutSection.bullets.map(b => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <p>{aboutSection.paragraphs[2]}</p>

            {/* Phones */}
            {phones.length > 0 && (
              <div
                itemProp="provider"
                itemScope
                itemType="https://schema.org/Person"
              >
                <p className="font-medium">Телефон:</p>
                <ul className="space-y-1">
                  {phones.map(href => {
                    const display = href.replace(/^tel:/, '');
                    return (
                      <li key={href}>
                        <AppLink
                          href={href}
                          className="text-accent"
                          itemProp="telephone"
                        >
                          {display}
                        </AppLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <p>{aboutSection.signature.label}</p>
            <p className="sign text-accent text-4xl">
              {aboutSection.signature.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
