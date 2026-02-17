'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CiCircleRemove, CiSearch } from 'react-icons/ci';
import { useDebouncedCallback } from 'use-debounce';

import { Btn } from '@/components/index';

const Search = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [inputValue, setInputValue] = useState<string>('');

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');

      const searchValue = e.target.value;

      if (searchValue.length > 2) {
        params.set('q', searchValue);
      } else {
        params.delete('q');
      }
      setInputValue(e.target.value);
      replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
    },
    300
  );

  return (
    <form className="mx-7 w-full">
      <label className="sr-only mb-2 text-sm font-medium text-gray-900">
        Пошук
      </label>
      <div className="relative flex w-full items-center justify-center">
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-3">
          <CiSearch />
        </div>
        <input
          type="text"
          name="search"
          className="focus:ring-primaryAccentColor focus:border-primaryAccentColor relative mr-4 block w-full rounded-lg border border-gray-300 bg-gray-50 py-1 ps-10 text-sm text-gray-900"
          placeholder={placeholder}
          required
          value={inputValue || ''}
          onChange={handleSearch}
        />
        <button
          type="button"
          className={`absolute top-[15%] right-30 ${inputValue ? 'block' : 'hidden'}`}
          style={{ display: inputValue ? 'block' : 'none' }}
          onClick={() => {
            setInputValue('');
            replace(`${pathname}`, { scroll: false });
          }}
        >
          <span
            className={`border-primaryAccentColor text-primaryAccentColor hover:bg-primaryAccentColor h-5 w-5 rounded-full border p-1 focus:bg-[primaryAccentColor] ${
              inputValue ? 'block' : 'hidden'
            }`}
          >
            <CiCircleRemove />
          </span>
        </button>
        <Btn type="submit" label="Знайти" />
      </div>
    </form>
  );
};

export default Search;
