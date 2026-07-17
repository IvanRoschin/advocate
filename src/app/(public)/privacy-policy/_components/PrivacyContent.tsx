import { privacyPolicyContent } from '@/app/resources/content/pages/privacy-policy.content';

const PrivacyContent = () => (
  <section className="min-w-0">
    <article className="border-border bg-card rounded-2xl border p-5 lg:p-6">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>{privacyPolicyContent.intro}</p>

        {privacyPolicyContent.sections.map(section => (
          <section key={section.title} className="mt-8 first:mt-0">
            <h2 className="text-foreground text-xl font-semibold">
              {section.title}
            </h2>

            <div className="mt-3 space-y-3">
              {section.body.map((paragraph, index) => (
                <p
                  key={`${section.title}-${index}`}
                  className="text-muted-foreground text-sm leading-7"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  </section>
);

export default PrivacyContent;
