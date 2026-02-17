import Btn from '@/app/components/ui/button/Btn';
import { practicesSection } from '@/app/resources';
import PracticesCard from './PracticesCard';

const Practices = () => {
  return (
    <section
      id={practicesSection.id}
      className="bg-[#191c23] py-40"
      itemScope
      itemType={practicesSection.schemaType}
    >
      <div className="container">
        <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <span className="bg-accent mb-4 h-8 w-px" />
          <p className="text-xs tracking-widest text-white uppercase">
            {practicesSection.header.uptitle}
          </p>
          <h2 className="font-eukrainehead mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {practicesSection.header.title}
          </h2>
          <span className="bg-accent mt-4 h-8 w-px" />
        </header>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 md:py-10 lg:grid-cols-4">
          {practicesSection.items.map(practice => (
            <PracticesCard
              key={practice.id}
              title={practice.title}
              text={practice.text}
              link={practice.link}
            />
          ))}
        </div>

        <div className="flex items-center justify-center">
          <Btn label={practicesSection.cta.label} />
        </div>
      </div>
    </section>
  );
};

export default Practices;
