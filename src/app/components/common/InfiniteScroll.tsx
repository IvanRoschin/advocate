'use client';

import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { TailSpin } from 'react-loader-spinner';

export interface PageResult<T> {
  data: T[];
  hasMore: boolean;
}

export interface InfiniteScrollHandle<T> {
  /**
   * Updates the currently loaded items directly (same functional-update
   * style as useState) — use after create/update/delete so the visible
   * list stays in sync; the component only seeds from `initialData` once.
   */
  setItems: Dispatch<SetStateAction<T[]>>;
}

interface InfiniteScrollProps<T> {
  initialData: T[];
  initialHasMore?: boolean;
  loadMore: (page: number) => Promise<PageResult<T>>;
  renderContent: (items: T[]) => ReactNode;
  emptyState?: ReactNode;
  endMessage?: ReactNode;
  loader?: ReactNode;
}

function InfiniteScrollInner<T>(
  {
    initialData,
    initialHasMore = true,
    loadMore,
    renderContent,
    emptyState,
    endMessage,
    loader,
  }: InfiniteScrollProps<T>,
  ref: ForwardedRef<InfiniteScrollHandle<T>>
) {
  const [items, setItems] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(initialHasMore);

  const pageRef = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isLoadingRef = useRef(false);

  useImperativeHandle(ref, () => ({ setItems }), []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingRef.current || allLoaded) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const nextPage = pageRef.current + 1;
      const result = await loadMore(nextPage);

      if (!result.hasMore || result.data.length === 0) {
        setAllLoaded(true);
      }

      if (result.data.length > 0) {
        pageRef.current = nextPage;
        setItems(prev => [...prev, ...result.data]);
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [allLoaded, loadMore]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      if (!node || allLoaded) return;

      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting) void handleLoadMore();
        },
        { threshold: 0.2 }
      );
      observerRef.current.observe(node);
    },
    [handleLoadMore, allLoaded]
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  if (items.length === 0) return <>{emptyState}</>;

  return (
    <>
      {renderContent(items)}
      {!allLoaded && <div ref={sentinelRef} className="h-10 w-full" />}
      <div className="flex justify-center py-6">
        {isLoading &&
          (loader ?? (
            <TailSpin
              visible
              height={40}
              width={40}
              color="#ea580c"
              ariaLabel="loading"
            />
          ))}
        {!isLoading && allLoaded && endMessage}
      </div>
    </>
  );
}

// forwardRef erases generics on the component's type; recast so callers
// still see InfiniteScroll<T> with a working ref instead of `unknown`.
export const InfiniteScroll = forwardRef(InfiniteScrollInner) as <T>(
  props: InfiniteScrollProps<T> & {
    ref?: ForwardedRef<InfiniteScrollHandle<T>>;
  }
) => ReturnType<typeof InfiniteScrollInner>;
