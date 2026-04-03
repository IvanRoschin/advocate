import { payment } from '@/app/resources/content';

function PaymentCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border-accent rounded-2xl border p-4">
      <p className="text-muted-foreground mb-1 text-sm">{label}</p>
      <p
        className={
          mono
            ? 'text-foreground font-medium tracking-wide break-all'
            : 'text-foreground font-medium'
        }
      >
        {value}
      </p>
    </div>
  );
}

export default function PaymentsContent() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
      <section className="min-w-0">
        <div className="mb-6">
          <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
            {payment.eyebrow}
          </p>

          <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-4xl">
            {payment.heading}
          </h1>

          <p className="text-app mt-4 max-w-2xl text-base leading-7">
            {payment.lead}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {payment.details.map(item => (
            <PaymentCard
              key={item.label}
              label={item.label}
              value={item.value}
              mono={item.mono}
            />
          ))}
        </div>

        <div className="bg-accent-40 mt-8 rounded-2xl p-5">
          <h2 className="text-accent text-xl font-semibold tracking-tight">
            {payment.notesTitle}
          </h2>

          <ul className="text-app mt-4 space-y-3 text-sm leading-6">
            {payment.notes.map(note => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
