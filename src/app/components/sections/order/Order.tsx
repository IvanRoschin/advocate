'use client';

import Image from 'next/image';

import LeadForm from '../../forms/LeadForm';

const Order = () => {
  return (
    <section
      id="order"
      className="relative flex flex-col items-center justify-center py-28 sm:py-36 lg:py-44"
    >
      {/* Background */}
      <Image
        src="/order_bg_v1.webp"
        alt="Фонове зображення для замовлення послуги"
        fill
        priority
        className="-z-20 object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/80 via-black/40 to-black/80" />

      <div className="font-eukraine container mx-auto flex flex-col items-center gap-10 px-4 lg:flex-row lg:gap-16">
        {/* LEFT — text */}
        <div className="bg-app/85 flex flex-1 flex-col gap-4 rounded-2xl p-6 text-center shadow-md backdrop-blur-md lg:text-left">
          <p className="text-accent text-xs tracking-widest uppercase">
            Заповніть форму
          </p>

          <h2 className="font-eukrainehead text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Як замовити послугу
          </h2>

          <p className="text-app text-base leading-relaxed sm:text-lg">
            Замовте зворотній звʼязок <br />
            Отримайте відповідь протягом години
          </p>
        </div>

        {/* RIGHT — form */}
        <div className="bg-app/85 surface-dark flex w-full max-w-md flex-1 flex-col rounded-2xl p-6 shadow-md backdrop-blur-md">
          <LeadForm />
        </div>
      </div>
    </section>
  );
};

export default Order;
