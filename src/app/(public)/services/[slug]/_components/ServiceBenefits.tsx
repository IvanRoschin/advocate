import { ServicePublicPageDto } from '@/app/types';

type Props = {
  service: ServicePublicPageDto;
};

const ServiceBenefits = ({ service }: Props) => {
  const benefits = service.sections.benefits;

  if (!benefits || benefits.items.length === 0) return null;

  return (
    <section className="container py-10">
      <div className="mb-6 max-w-2xl">
        <h2 className="title-app text-accent text-2xl font-semibold lg:text-3xl">
          {benefits.title}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="border-border bg-card rounded-2xl border p-5"
          >
            <h3 className="text-accent text-lg font-semibold">{item.title}</h3>

            <p className="text-app mt-3 text-sm leading-6">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ServiceBenefits;
