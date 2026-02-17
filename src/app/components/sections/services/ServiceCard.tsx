type Props = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

const ServiceCard = ({ icon, title, text }: Props) => {
  return (
    <div className="fg-app border-accent items-top flex border-b p-6 text-start shadow-md transition-transform duration-300 last:border-b-0 hover:scale-105 hover:shadow-lg md:border-r md:border-b md:last:border-r-0 md:nth-2:border-r-0 md:nth-3:border-b-0 lg:border-b-0 lg:nth-2:border-r">
      <div className="text-accent mr-4 shrink-0 text-4xl">{icon}</div>
      <div>
        <h3 className="font-eukrainehead mb-2 text-xl font-semibold text-white">
          {title}
        </h3>
        <p className="text-sm text-white md:text-base">{text}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
