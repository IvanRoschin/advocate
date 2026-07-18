import { ServicePublicPageDto } from '@/app/types';

type Props = {
  service: ServicePublicPageDto;
};

const ServiceProcess = ({ service }: Props) => {
  const process = service.sections.process;

  if (!process || process.steps.length === 0) return null;

  return (
    <section className="container py-10">
      <div className="mb-10 max-w-2xl">
        <h2 className="title-app text-accent text-2xl font-semibold lg:text-3xl">
          {process.title}
        </h2>
      </div>

      <div className="relative">
        <div
          className="absolute top-2 bottom-2 left-4.75 w-px lg:left-5.75"
          style={{ backgroundColor: 'var(--accentcolor)', opacity: 0.25 }}
        />

        <div className="space-y-8">
          {process.steps.map((step, index) => (
            <div
              key={`${step.title}-${index}`}
              className="relative flex gap-5 pl-0"
            >
              <div
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold lg:h-12 lg:w-12"
                style={{
                  borderColor: 'var(--accentcolor)',
                  color: 'var(--accentcolor)',
                  backgroundColor: 'var(--background)',
                }}
              >
                {index + 1}
              </div>

              <div className="min-w-0 pt-1.5">
                <h3 className="text-accent text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-app mt-2 text-sm leading-6">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceProcess;
