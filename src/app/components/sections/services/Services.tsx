import { FaRegRegistered } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { LuBriefcaseBusiness } from 'react-icons/lu';
import { SiTheboringcompany } from 'react-icons/si';

import ServiceCard from './ServiceCard';

const data = [
  {
    icon: <FaRegRegistered />,
    title: 'Реєстрація бізнесу',
    text: 'Реєстрація ФОП, ТОВ, зміна керівника, адреси, КВЕД',
  },
  {
    icon: <LuBriefcaseBusiness />,
    title: 'Супроводження бізнесу',
    text: 'Розробка бізнес-моделі, підготовка проектів договорів, аналіз запропонованого договору',
  },
  {
    icon: <SiTheboringcompany />,
    title: 'Господарські спори',
    text: 'Відшкодування шкоди внаслідок невиконання договірних зобов’язань, представництво в суді',
  },
  {
    icon: <IoIosPeople />,
    title: 'Цивільні спори',
    text: 'Сімейні, спадкові спори, спори, що виникають з договірних та позадоговірних зобов’язань',
  },
];

const Services = () => {
  return (
    <section className="absolute top-full left-0 z-20 w-full -translate-y-1/5 sm:-translate-y-1/4 md:-translate-y-1/2">
      <div className="container grid grid-cols-1 md:grid-cols-2 md:py-10 lg:grid-cols-4">
        {data.map((service, i) => (
          <ServiceCard
            key={i}
            icon={service.icon}
            title={service.title}
            text={service.text}
          />
        ))}
      </div>
    </section>
  );
};

export default Services;
