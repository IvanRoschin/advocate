'use client';

import { Btn, LeadForm, Modal } from '@/app/components';
// Подставь свой реальный компонент формы
import { useModal } from '@/app/hooks/useModal';

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
              <LeadForm />
            </div>
          </div>
        }
      />
    </>
  );
}
