'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { AppLink } from '@/components';

type Props = {
  count: number;
  pageNumbers: number[];
};

const Pagination = ({ count, pageNumbers }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  const page = parseInt(searchParams.get('page') || '1');
  const ITEM_PER_PAGE = 4;
  params.set('limit', ITEM_PER_PAGE.toString());

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  const handleChangePage = (type: 'назад' | 'вперед') => {
    const newPage = type === 'назад' ? page - 1 : page + 1;
    params.set('page', newPage.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex justify-between p-2">
      <button
        className="nav cursor-pointer rounded-2xl bg-slate-300 px-8 py-2 disabled:cursor-not-allowed"
        disabled={!hasPrev}
        onClick={() => handleChangePage('назад')}
      >
        Назад
      </button>
      <div className="flex items-center justify-center gap-4">
        {pageNumbers.map((pageNumber, index) => (
          <div key={index}>
            <AppLink
              href={`?page=${pageNumber}`}
              className={
                page === pageNumber
                  ? 'text-primaryAccentColor bg-transparent p-3'
                  : 'text-primaryTextColor hover:text-primaryAccentColor bg-transparent p-2'
              }
            >
              {pageNumber}
            </AppLink>
          </div>
        ))}
      </div>
      <button
        className="nav cursor-pointer rounded-2xl bg-slate-300 px-8 py-2 disabled:cursor-not-allowed"
        disabled={!hasNext}
        onClick={() => handleChangePage('вперед')}
      >
        Вперед
      </button>
    </div>
  );
};

export default Pagination;
