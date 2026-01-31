'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import slugify from 'slugify';
import { toast } from 'sonner';

import { apiUrl } from '@/app/config/routes';
import categorySchema, {
  CategoryFormValues,
} from '@/app/helpers/validation-schemas/category-schema';
// import { CloudinaryUploadWidget } from '@/app/lib';
import ImageUploadCloudinary from '@/app/lib/client/cloudinary-multiplay-upload-widget';
import Btn from '@/app/ui/button/Btn';
import { Input } from '@/components/index';

const CategoryForm = () => {
  return (
    <Formik<CategoryFormValues>
      initialValues={{
        title: '',
        src: [],
      }}
      validationSchema={categorySchema}
      onSubmit={async (values, { resetForm }) => {
        const payload = {
          title: values.title,
          slug: slugify(values.title, {
            lower: true,
            strict: true,
            locale: 'uk',
            trim: true,
          }),
          src: values.src,
        };

        try {
          const res = await fetch(apiUrl('categories'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const json = await res.json();

          if (!res.ok) {
            toast.error(`Помилка: ${json?.error?.message || res.statusText}`);
            return;
          }

          toast.success('Категорія успішно додана!');
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : 'Сталася невідома помилка';
          toast.error(message);
        } finally {
          resetForm();
        }
      }}
    >
      {({ isValid, isSubmitting, setFieldValue, values, errors }) => (
        <Form className="flex w-full max-w-lg flex-col gap-4">
          <Input name="title" label="Назва категорії" required />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ImageUploadCloudinary
              setFieldValue={setFieldValue}
              values={values.src}
              error={typeof errors.src === 'string' ? errors.src : undefined}
              uploadPreset="Categories"
              multiple
            />
          </motion.div>
          <div className="flex justify-end">
            <Btn
              radius={12}
              type="submit"
              title="Додати категорію"
              disabled={!isValid || isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
