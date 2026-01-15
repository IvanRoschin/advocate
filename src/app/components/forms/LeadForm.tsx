'use client';

import { Form, Formik } from 'formik';

import leadSchema from '@/app/helpers/validation-schemas/lead-schema';
import { apiFetch } from '@/app/lib/api-client';
import Btn from '@/app/ui/button/Btn';

import Checkbox from '../inputs/Checkbox';
import Input from '../inputs/Input';

const LeadForm = () => {
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        phone: '+380',
        consent: false,
      }}
      validationSchema={leadSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          const lead = await apiFetch('/api/leads', {
            method: 'POST',
            body: JSON.stringify(values),
          });

          console.log('✅ Lead created', lead);
        } catch (e) {
          if (e instanceof Error) {
            console.error('❌ Error:', e.message);
          }
        }
        resetForm();
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form className="space-y-4 text-left">
          {/* Form header */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-white">
              Залишити заявку
            </h3>
            <p className="text-app/70 text-sm">
              Ми звʼяжемось з вами протягом години
            </p>
          </div>

          <Input name="name" label="Імʼя" required />
          <Input name="email" label="Email" type="email" required />
          <Input name="phone" label="Телефон" type="tel" required />

          <Checkbox name="consent">
            Заповнюючи форму, я даю згоду на збір та обробку персональних даних
          </Checkbox>

          <Btn
            type="submit"
            title="Надіслати"
            disabled={!isValid || isSubmitting}
            className={`transition-opacity duration-300 ${!isValid ? 'cursor-not-allowed opacity-60' : 'opacity-100'}`}
          />
        </Form>
      )}
    </Formik>
  );
};

export default LeadForm;
