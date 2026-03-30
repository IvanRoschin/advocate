'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface SwitcherProps {
  id?: string;
  label?: string;
  description?: string;
  labels?: [string, string];
  checked: boolean;
  disabled?: boolean;
  loading?: boolean;
  onChange: (checked: boolean) => void;
  labelPosition?: 'top' | 'left';
}

const Switcher: React.FC<SwitcherProps> = ({
  id,
  label,
  description,
  labels = ['Вимк.', 'Увімк.'],
  checked,
  disabled = false,
  loading = false,
  onChange,
  labelPosition = 'left',
}) => {
  const isDisabled = disabled || loading;

  const toggle = () => {
    if (isDisabled) return;
    onChange(!checked);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = e => {
    if (isDisabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      className={`flex gap-3 ${
        labelPosition === 'top'
          ? 'flex-col items-start'
          : 'items-center justify-between'
      }`}
    >
      {(label || description) && (
        <div className="min-w-0">
          {label ? (
            <label
              htmlFor={id}
              className="text-foreground block text-sm font-medium"
            >
              {label}
            </label>
          ) : null}

          {description ? (
            <p className="text-muted-foreground mt-1 text-xs">{description}</p>
          ) : null}
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground min-w-18 text-right text-sm select-none">
          {checked ? labels[1] : labels[0]}
        </span>

        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-disabled={isDisabled}
          disabled={isDisabled}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-200 ${
            checked ? 'border-accent bg-accent/15' : 'border-border bg-muted'
          } ${
            isDisabled
              ? 'cursor-not-allowed opacity-60'
              : 'hover:ring-accent/20 cursor-pointer hover:ring-4'
          }`}
        >
          <motion.span
            animate={{ x: checked ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 650, damping: 34 }}
            className={`absolute top-1 left-1 h-5 w-5 rounded-full shadow-sm ${
              checked ? 'bg-accent' : 'bg-background'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Switcher;
