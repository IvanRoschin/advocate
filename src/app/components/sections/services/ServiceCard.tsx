type Props = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

const ServiceCard = ({ icon, title, text }: Props) => {
  return (
    <div className="bg-services-card border-accent flex h-full flex-col items-center border-r border-b p-4 text-center shadow-md transition-transform duration-300 last:border-r-0 hover:scale-105 hover:shadow-lg nth-2:border-r-0 nth-3:border-b-0 sm:flex-row sm:items-start sm:p-6 sm:text-start lg:border-b-0 lg:nth-2:border-r">
      <div className="text-accent mb-2 shrink-0 text-3xl sm:mr-4 sm:mb-0 sm:text-4xl">
        {icon}
      </div>
      <div>
        <h3 className="text-services-title font-eukrainehead mb-2 line-clamp-2 min-h-[2lh] text-base font-semibold sm:text-xl">
          {title}
        </h3>
        <p className="text-services-text line-clamp-4 min-h-[4lh] text-sm md:text-base">
          {text}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
