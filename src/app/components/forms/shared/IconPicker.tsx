import { iconLibrary } from '@/app/resources';
import {
  CATEGORY_ICON_KEYS,
  CategoryIconKey,
} from '@/app/resources/category-icons';

export const IconPicker = ({
  value,
  onChange,
}: {
  value: CategoryIconKey;
  onChange: (v: CategoryIconKey) => void;
}) => {
  return (
    <div className="grid grid-cols-6 gap-2">
      {CATEGORY_ICON_KEYS.map(key => {
        const Icon = iconLibrary[key];

        const active = value === key;

        return (
          <button
            type="button"
            key={key}
            onClick={() => onChange(key)}
            className={[
              'flex h-10 w-10 items-center justify-center rounded-lg border transition',
              active
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border hover:bg-muted',
            ].join(' ')}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
};
