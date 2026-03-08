import Link from 'next/link';

export default function PaymentsAside() {
  return (
    <div className="border-accent rounded-2xl border p-6">
      <h2 className="text-accent text-xl font-semibold tracking-tight">
        Потрібна допомога з оплатою?
      </h2>

      <p className="text-app mt-3 text-sm leading-6">
        Якщо у вас виникли питання щодо реквізитів, формату платежу або
        підтвердження оплати, звʼяжіться для уточнення деталей перед переказом
        коштів.
      </p>

      <div className="mt-6 space-y-3">
        <Link
          href="/contact"
          className="bg-accent inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Зв’язатися для уточнення
        </Link>

        <a
          href="tel:+380000000000"
          className="border-accent text-accent hover:bg-accent-40 inline-flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
        >
          Зателефонувати
        </a>
      </div>

      <div className="border-accent mt-6 border-t pt-4">
        <p className="text-muted-foreground text-xs leading-5">
          Після оплати збережіть квитанцію або скриншот платежу до підтвердження
          отримання коштів.
        </p>
      </div>
    </div>
  );
}
