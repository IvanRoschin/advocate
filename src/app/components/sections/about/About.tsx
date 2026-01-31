import Image from 'next/image';
import Link from 'next/link';

const phones = [
  process.env.NEXT_PUBLIC_ADVOCATE_PN_1,
  process.env.NEXT_PUBLIC_ADVOCATE_PN_2,
].filter(Boolean);

const About = () => {
  return (
    <section
      id="about"
      className="bg-[#21242b] pt-120 sm:pt-100 md:py-60 lg:pt-40"
      itemScope
      itemType="https://schema.org/LegalService"
    >
      <div className="font-eukraine container">
        {/* Заголовок */}
        <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <span className="bg-accent mb-4 h-8 w-px" />
          <p className="text-xs tracking-widest text-white uppercase">
            інформація про адвоката
          </p>
          <h2 className="font-eukrainehead mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Основні принципи моєї роботи
          </h2>
          <span className="bg-accent mt-4 h-8 w-px" />
        </header>
        {/* Контент */}
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-0 lg:mt-30">
          {/* Фото */}
          <div
            className="relative h-105 w-full max-w-70 shadow-lg sm:h-140 sm:max-w-90 md:-mt-24 lg:-mt-48"
            itemScope
            itemType="https://schema.org/Person"
          >
            <Image
              src="/ivan_roschin.webp"
              alt="Адвокат Рощин Іван Геннадійович"
              fill
              sizes="(max-width: 640px) 280px, 360px"
              className="object-cover"
              itemProp="image"
            />
            <meta itemProp="name" content="Іван Рощин" />
            <meta itemProp="jobTitle" content="Адвокат" />
          </div>

          {/* Текст */}
          <div className="bg-app text-app { w-full max-w-90 space-y-4 p-6 text-sm text-black sm:p-8 sm:text-base md:max-w-[50%] md:p-14">
            <h3 className="font-eukrainehead text-lg font-semibold text-black sm:text-xl">
              Надійний <span className="text-accent">захист</span> Вашої позиції
              <br />
              <span className="text-accent">правовими аргументами</span>
            </h3>

            <p itemProp="description">
              Адвокат із досвідом юридичної практики понад{' '}
              <strong>10 років</strong>. Надаю правову допомогу бізнесу та
              фізичним особам.
            </p>

            <p>
              Спеціалізуюсь у сфері цивільного та господарського права.
              Представляю інтереси клієнтів у спорах щодо:
            </p>

            <ul className="list-disc space-y-1 pl-5">
              <li>відшкодування шкоди;</li>
              <li>договірних і позадоговірних зобовʼязань;</li>
              <li>сімейних, спадкових та житлових спорів;</li>
              <li>кредитних правовідносин.</li>
            </ul>

            <p>
              Працюю виключно в межах закону та будую співпрацю на принципах
              відповідальності, чесності та взаємоповаги.
            </p>

            {/* Контакты */}
            {phones.length > 0 && (
              <div
                itemProp="provider"
                itemScope
                itemType="https://schema.org/Person"
              >
                <p className="font-medium">Телефон:</p>
                <ul className="space-y-1">
                  {phones.map(phone => (
                    <li key={phone}>
                      <Link
                        href={`tel:${phone}`}
                        className="text-accent"
                        itemProp="telephone"
                      >
                        {phone}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p>Ваш адвокат</p>
            <p className="sign text-accent text-4xl">Ivan Roschin</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
