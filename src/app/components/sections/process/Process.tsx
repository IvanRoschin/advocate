import { processSection } from '@/app/resources';

export default function Process() {
  const { id, header, steps } = processSection;

  return (
    <section id={id} className="bg-practices-section section">
      <div className="container mx-auto px-4">
        <header className="section-header">
          <span className="bg-accent mb-4 h-8 w-px" />
          <p className="text-practices-uptitle text-xs tracking-widest uppercase">
            {header.uptitle}
          </p>
          <h2 className="text-practices-title font-eukrainehead mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">
            {header.title}
          </h2>
          <span className="bg-accent mt-4 h-8 w-px" />
        </header>

        <ol className="section-content grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="border-accent/30 hover:border-accent relative rounded-2xl border p-6 transition-colors"
            >
              <span className="text-accent font-eukrainehead text-4xl font-bold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-practices-title font-eukrainehead mt-3 mb-2 text-lg font-semibold">
                {step.title}
              </h3>
              <p className="text-app text-sm md:text-base">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
