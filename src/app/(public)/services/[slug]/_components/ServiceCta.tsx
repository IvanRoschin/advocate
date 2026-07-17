import { ServicePublicPageDto } from '@/app/types';

import ServiceCtaOrderButton from './ServiceCtaOrderButton';

type Props = {
  service: ServicePublicPageDto;
};

const ServiceCta = ({ service }: Props) => {
  const cta = service.sections.cta;

  if (!cta) return null;

  return (
    <section className="container py-10 lg:pb-14">
      <div className="border-border bg-card rounded-3xl border p-6 lg:p-8">
        <div className="max-w-2xl">
          <h2 className="title-app text-accent text-2xl font-semibold lg:text-3xl">
            {cta.title}
          </h2>

          <p className="text-app mt-4 text-base leading-7">{cta.description}</p>

          <div className="mt-6">
            <ServiceCtaOrderButton label={cta.buttonLabel} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCta;
