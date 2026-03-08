type PaymentDetail = {
  label: string;
  value: string;
  mono?: boolean;
};

const paymentDetails: PaymentDetail[] = [
  {
    label: 'Отримувач',
    value: 'Іван Рощин',
  },
  {
    label: 'IBAN',
    value: 'UA00 0000 0000 0000 0000 0000 000',
    mono: true,
  },
  {
    label: 'ЄДРПОУ / РНОКПП',
    value: '3146909540',
    mono: true,
  },
  {
    label: 'Банк',
    value: 'АТ КБ "ПриватБанк"',
  },
  {
    label: 'Призначення платежу',
    value: 'Оплата юридичних послуг згідно домовленості',
  },
];

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
      <div className="">
        <section className="min-w-0">
          <div className="mb-6">
            <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
              Оплата послуг
            </p>
            <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-4xl">
              Реквізити для оплати юридичної допомоги
            </h1>

            <p className="text-app mt-4 max-w-2xl text-base leading-7">
              На цій сторінці розміщені реквізити для оплати консультацій та
              юридичних послуг. Перед здійсненням платежу рекомендовано узгодити
              суму, формат послуги та призначення платежу.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {paymentDetails.map(item => (
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
              Важливо перед оплатою
            </h2>

            <ul className="text-app mt-4 space-y-3 text-sm leading-6">
              <li>
                Перевірте коректність реквізитів та суму платежу перед
                підтвердженням переказу.
              </li>
              <li>
                У призначенні платежу бажано вказувати суть послуги або номер
                домовленості, якщо він був погоджений.
              </li>
              <li>
                Якщо вам потрібен рахунок, акт або інше підтвердження оплати —
                узгодьте це до проведення платежу.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
