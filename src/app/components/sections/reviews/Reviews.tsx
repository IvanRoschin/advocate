'use client';

import ReviewCard from './ReviewCard';

const reviews = [
  {
    name: 'Наталя',
    order: 'Консультація юриста',
    text: 'Велике дякую Івану за професійне вирішення всіх питань. Людина, яка добре знає свою справу та глибоко вникає у суть проблеми.',
  },
  {
    name: 'Hydro Heating Systems',
    order: 'Договір: будівництво та ремонт',
    text: 'Професійно виконав завдання: правильно поставив питання, відчувалось, що є досвід. Рекомендую!',
  },
  {
    name: 'Олександр',
    order: 'Консультація юриста',
    text: 'Іван підбирає рішення, яке є найкращим для вас особисто і оптимально прийнятним з юридичної точки зору.',
  },
  {
    name: 'Єлизавета Л.',
    order: 'Підготовка пакету юридичних документів',
    text: 'Іван зміг підготувати дуже детальну юридичну модель. Дуже приємно співпрацювати з таким професіоналом.',
  },
];

const Reviews = () => {
  return (
    <section id="reviews" className="fg-app py-20">
      <div className="container mx-auto px-4">
        <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <span className="bg-accent mb-4 h-8 w-px" />

          <h2 className="font-eukrainehead mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Відгуки клієнтів{' '}
          </h2>
          <p className="text-xs tracking-widest text-white uppercase">
            Кожен відгук — від реальних клієнтів, які отримали професійну
            допомогу та результат.{' '}
          </p>
          <span className="bg-accent mt-4 h-8 w-px" />
        </header>

        {/* Карточки отзывов */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
