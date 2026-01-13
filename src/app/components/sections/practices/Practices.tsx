import Btn from '@/app/ui/button/Btn';
import PracticesCard from './PracticesCard';

const data = [
  {
    title: 'Реєстрація бізнесу',
    text: 'Реєстрація ФОП, ТОВ, ГО, зміна керівника, адреси, КВЕД',
    link: '/#',
  },
  {
    title: 'Договірна робота',
    text: 'Індивідуальний договір, розроблений під клієнта. Максимальний захист інтересів',
    link: '/#',
  },
  {
    title: 'Перевірка нерухомості',
    text: 'Аналіз ризиків, перевірка забудовника: репутація, судові справи',
    link: '/#',
  },
  {
    title: 'Стягнення боргів',
    text: 'Механізми повернення боргу, досудова робота і примусове стягнення',
    link: '/#',
  },
];

const Practices = () => {
  return (
    <section
      id="practices"
      className="bg-[#191c23] py-40"
      itemScope
      itemType="https://schema.org/LegalService"
    >
      <div className="container">
        {/* Заголовок */}
        <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <span className="bg-accent mb-4 h-8 w-px" />
          <p className="text-xs tracking-widest text-white uppercase">
            практики
          </p>
          <h2 className="font-eukrainehead mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Послуги адвоката
          </h2>
          <span className="bg-accent mt-4 h-8 w-px" />
        </header>
        {/* Контент */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 md:py-10 lg:grid-cols-4">
          {data.map((practice, i) => (
            <PracticesCard
              key={i}
              title={practice.title}
              text={practice.text}
              link={practice.link}
            />
          ))}
        </div>
        <div className="flex items-center justify-center">
          <Btn title="Більше послуг" />
        </div>
      </div>
    </section>
  );
};

export default Practices;
