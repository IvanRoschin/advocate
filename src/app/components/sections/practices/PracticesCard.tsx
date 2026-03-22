import Link from 'next/link';

import Btn from '@/app/components/ui/button/Btn';

type Props = {
  title: string;
  description: string;
  href: string;
};

const PracticesCard = ({ title, description, href }: Props) => {
  return (
    <div className="bg-practices-card flex h-full flex-col p-6 text-start shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex-1">
        <Link href={href} className="group block">
          <h3 className="text-practices-card-title font-eukrainehead relative mb-4 inline-block text-xl font-semibold uppercase">
            <span className="block lg:hidden">{title}</span>

            <span className="hidden lg:block">
              {title.split(' ').map((word, index) => (
                <span key={`${word}-${index}`} className="block">
                  {word}
                </span>
              ))}
            </span>

            <span className="bg-accent absolute -bottom-2 left-0 h-0.75 w-8 transition-all duration-500 ease-out group-hover:w-full" />
          </h3>
        </Link>

        <p className="text-app text-sm md:text-base">{description}</p>
      </div>

      <div className="mt-6 flex justify-center">
        <Link href={href}>
          <Btn label="Далі" uiVariant="outline" />
        </Link>
      </div>
    </div>
  );
};

export default PracticesCard;
