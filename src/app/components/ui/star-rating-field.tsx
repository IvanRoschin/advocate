'use client';

import { useField, useFormikContext } from 'formik';
import { Star } from 'lucide-react';
import { KeyboardEvent, useId, useMemo, useState } from 'react';

type Props = {
  name: string;
  label?: string;
  max?: number;
  step?: 0.5 | 1;
  required?: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const roundToStep = (value: number, step: number) =>
  Math.round(value / step) * step;

const StarRatingField = ({
  name,
  label = 'Рейтинг',
  max = 5,
  step = 0.5,
  required = false,
}: Props) => {
  const id = useId();
  const [field, meta] = useField<number | undefined>(name);
  const { setFieldValue, setFieldTouched } =
    useFormikContext<Record<string, unknown>>();
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const committedValue =
    typeof field.value === 'number' ? clamp(field.value, 0, max) : 0;

  const displayValue = hoverValue ?? committedValue;

  const ariaValueText = useMemo(() => {
    if (displayValue === 0) return 'Без оцінки';
    return Number.isInteger(displayValue)
      ? `${displayValue} з ${max}`
      : `${displayValue.toFixed(1)} з ${max}`;
  }, [displayValue, max]);

  const updateValue = async (value: number) => {
    const normalized = clamp(roundToStep(value, step), 0, max);
    await setFieldValue(name, normalized);
    await setFieldTouched(name, true, false);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowUp' ? step : -step;

    if (
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowDown'
    ) {
      event.preventDefault();
      await updateValue(committedValue + delta);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      await updateValue(step);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      await updateValue(max);
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      await updateValue(0);
    }
  };

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>

      <div
        id={id}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-required={undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={displayValue}
        aria-valuetext={ariaValueText}
        onKeyDown={handleKeyDown}
        onBlur={() => setFieldTouched(name, true, false)}
        onMouseLeave={() => setHoverValue(null)}
        className="focus-visible:ring-accent inline-flex w-fit items-center gap-1 rounded-xl ring-offset-2 transition outline-none focus-visible:ring-2"
      >
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          const fill = clamp(displayValue - index, 0, 1) * 100;

          const handlePointerMove = (
            event: React.MouseEvent<HTMLButtonElement>
          ) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const rawValue =
              index + (step === 0.5 ? (offsetX < rect.width / 2 ? 0.5 : 1) : 1);

            setHoverValue(rawValue);
          };

          const handleClick = async (
            event: React.MouseEvent<HTMLButtonElement>
          ) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const rawValue =
              index + (step === 0.5 ? (offsetX < rect.width / 2 ? 0.5 : 1) : 1);

            await updateValue(rawValue);
          };

          return (
            <button
              key={starNumber}
              type="button"
              aria-label={`${starNumber} ${starNumber === 1 ? 'зірка' : 'зірки'}`}
              onMouseMove={handlePointerMove}
              onClick={handleClick}
              className="group relative size-8 shrink-0 transition duration-150 hover:scale-110 active:scale-95"
            >
              <Star className="text-muted-foreground/35 size-8" />

              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{ width: `${fill}%` }}
              >
                <Star className="size-8 fill-yellow-400 text-yellow-400 drop-shadow-sm transition-colors duration-150" />
              </div>
            </button>
          );
        })}

        <span className="text-muted-foreground ml-2 min-w-14 text-sm">
          {ariaValueText}
        </span>
      </div>

      {meta.touched && meta.error ? (
        <p className="text-destructive text-sm">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default StarRatingField;
