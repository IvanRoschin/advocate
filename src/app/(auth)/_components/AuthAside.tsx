import { AppLink } from '@/components';

const authBenefits = [
  'Безпечний вхід до особистого кабінету',
  'Швидке відновлення доступу без зайвих кроків',
  'Підтвердження email та контроль безпеки акаунта',
];

export default function AuthAside() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:justify-center">
      <div className="max-w-xl">
        <p className="text-accent mb-4 text-xs tracking-[0.28em] uppercase">
          Account access
        </p>

        <h1 className="font-eukrainehead text-4xl leading-tight font-bold xl:text-5xl">
          Єдиний простір для
          <span className="text-accent"> входу</span>, підтвердження email та
          відновлення доступу
        </h1>

        <p className="text-muted-foreground mt-6 max-w-lg text-base leading-relaxed xl:text-lg">
          Усі сторінки авторизації оформлені в єдиному стилі, щоб користувач
          легко орієнтувався в процесі входу, підтвердження облікового запису та
          зміни пароля.
        </p>

        <div className="mt-8 grid gap-4">
          {authBenefits.map(item => (
            <div
              key={item}
              className="bg-background/70 border-border/60 flex items-center rounded-2xl border px-4 py-4 shadow-sm backdrop-blur-sm"
            >
              <span className="bg-accent mr-4 h-2.5 w-2.5 shrink-0 rounded-full" />
              <span className="text-sm xl:text-base">{item}</span>
            </div>
          ))}
        </div>

        <div className="border-border/60 mt-10 flex items-center justify-between gap-4 border-t pt-6">
          <div>
            <p className="text-sm font-medium">Потрібна допомога з доступом?</p>
            <p className="text-muted-foreground text-sm">
              Перейдіть до контактів або поверніться на головну.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <AppLink href="/" className="text-accent text-sm font-medium">
              Головна
            </AppLink>
            <AppLink
              href="/contacts"
              className="text-accent text-sm font-medium"
            >
              Контакти
            </AppLink>
          </div>
        </div>
      </div>
    </aside>
  );
}
