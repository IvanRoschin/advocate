import Btn from '@/app/ui/button/Btn';

type Props = {
  title: string;
  text: string;
  link: string;
};

const PracticesCard = ({ title, text, link }: Props) => {
  return (
    <div className="bg-app flex h-full flex-col p-6 text-start shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Верхний контент */}
      <div className="flex-1">
        <a href={link}>
          <h3 className="font-eukrainehead title-app group relative mb-4 inline-block text-xl font-semibold uppercase">
            {/* Mobile / Tablet */}
            <span className="block lg:hidden">{title}</span>

            {/* Desktop */}
            <span className="hidden lg:block">
              {title.split(' ').map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </span>
            {/* underline */}
            <span className="bg-accent absolute -bottom-2 left-0 h-0.75 w-8 transition-all duration-500 ease-out group-hover:w-full" />
          </h3>
        </a>
        <p className="text-app text-sm md:text-base">{text}</p>
      </div>

      {/* Низ карточки */}
      <div className="mt-6 flex justify-center">
        <Btn title="Далі" uiVariant="outline" />
      </div>
    </div>
  );
};

export default PracticesCard;
