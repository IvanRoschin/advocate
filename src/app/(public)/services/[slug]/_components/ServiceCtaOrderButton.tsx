'use client';

import dynamic from 'next/dynamic';

import { Btn, Modal, Skeleton } from '@/app/components';
import { useModal } from '@/app/hooks/useModal';

// Форма заявки потрібна лише у відкритій модалці — не тягнемо її JS
// (Formik/Yup/Turnstile) під час завантаження сторінки послуги.
const LeadForm = dynamic(
  () => import('@/app/components/forms/public/PublicLeadForm'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full rounded-xl" />,
  }
);

type Props = {
  label: string;
};

export default function ServiceCtaOrderButton({ label }: Props) {
  const orderModal = useModal('orderModal');

  return (
    <>
      <Btn
        onClick={orderModal.open}
        uiVariant="accent"
        radius={12}
        type="button"
        label={label}
      />

      <Modal
        isOpen={orderModal.isOpen}
        onClose={orderModal.close}
        body={
          <div className="flex flex-col gap-6 p-2 sm:p-4">
            <div className="text-center">
              <h2 className="text-accent text-2xl font-semibold lg:text-3xl">
                Замовити консультацію
              </h2>

              <p className="text-app mt-2 text-sm leading-6">
                Залиште заявку, і ми звʼяжемося з вами найближчим часом
              </p>
            </div>

            <div className="mt-2">
              {orderModal.isOpen ? <LeadForm source="home" /> : null}
            </div>
          </div>
        }
      />
    </>
  );
}
