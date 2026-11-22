import Link from 'next/link';

type Props = {
  icon: React.ReactNode;
  title: string;
  text: string;
  href: string;
  price?: string;
  moreLabel: string;
};

const ServiceCard = ({ icon, title, text, href, price, moreLabel }: Props) => {
  return (
    <Link
      href={href}
      className="bg-services-card border-accent group flex h-full items-start border-b p-6 text-start shadow-md transition-transform duration-300 last:border-b-0 hover:scale-105 hover:shadow-lg md:border-r md:border-b md:last:border-r-0 md:nth-2:border-r-0 md:nth-3:border-b-0 lg:border-b-0 lg:nth-2:border-r"
    >
      <div className="text-accent mr-4 shrink-0 text-4xl">{icon}</div>
      <div className="flex h-full flex-col">
        <h2 className="text-services-title font-eukrainehead mb-2 text-xl font-semibold">
          {title}
        </h2>
        <p className="text-services-text text-sm md:text-base">{text}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-sm">
          {price ? (
            <span className="text-services-title font-semibold">{price}</span>
          ) : (
            <span />
          )}
          <span className="text-accent group-hover:underline">
            {moreLabel} →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
