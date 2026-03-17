'use client';

import { FieldArray } from 'formik';

import Btn from '@/app/components/ui/button/Btn';
import { Input, Textarea } from '@/components';

type ItemMode = 'title-description' | 'question-answer';

type TitleDescriptionItem = {
  title: string;
  description: string;
};

type QuestionAnswerItem = {
  question: string;
  answer: string;
};

type Props = {
  sectionTitle: string;
  sectionFieldName: string;
  sectionLabel: string;
  itemsFieldName: string;
  items: TitleDescriptionItem[] | QuestionAnswerItem[];
  mode: ItemMode;
  addButtonLabel: string;
  itemLabelPrefix: string;
};

const createEmptyItem = (mode: ItemMode) => {
  if (mode === 'question-answer') {
    return { question: '', answer: '' };
  }

  return { title: '', description: '' };
};

const RepeatableFieldsSection = ({
  sectionTitle,
  sectionFieldName,
  sectionLabel,
  itemsFieldName,
  items,
  mode,
  addButtonLabel,
  itemLabelPrefix,
}: Props) => {
  const isFaq = mode === 'question-answer';

  return (
    <div className="border-border rounded-2xl border p-4">
      <h3 className="text-accent mb-4 text-lg font-semibold">{sectionTitle}</h3>

      <div className="grid gap-4">
        <Input name={sectionFieldName} label={sectionLabel} />

        <FieldArray name={itemsFieldName}>
          {({ push, remove }) => (
            <div className="grid gap-4">
              {items.map((_, index) => (
                <div
                  key={`${itemsFieldName}-${index}`}
                  className="border-border rounded-xl border p-4"
                >
                  <div className="grid gap-4">
                    {isFaq ? (
                      <>
                        <Input
                          name={`${itemsFieldName}.${index}.question`}
                          label={`${itemLabelPrefix} #${index + 1} question`}
                        />
                        <Textarea
                          name={`${itemsFieldName}.${index}.answer`}
                          label={`${itemLabelPrefix} #${index + 1} answer`}
                          rows={3}
                        />
                      </>
                    ) : (
                      <>
                        <Input
                          name={`${itemsFieldName}.${index}.title`}
                          label={`${itemLabelPrefix} #${index + 1} title`}
                        />
                        <Textarea
                          name={`${itemsFieldName}.${index}.description`}
                          label={`${itemLabelPrefix} #${index + 1} description`}
                          rows={3}
                        />
                      </>
                    )}

                    <div className="flex justify-end">
                      <Btn
                        type="button"
                        label="Видалити"
                        uiVariant="ghost"
                        onClick={() => remove(index)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <Btn
                  type="button"
                  label={addButtonLabel}
                  uiVariant="ghost"
                  onClick={() => push(createEmptyItem(mode))}
                />
              </div>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

export default RepeatableFieldsSection;
