import { type Accessor, createMemo, createSignal } from 'solid-js';

function paginationRange(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
}

export const DOTS = 'dots' as const;

export interface CreatePaginationOptions {
  initialPage?: number;
  page?: number;
  total: number;
  siblings?: number;
  boundaries?: number;
  onChange?: (page: number) => void;
}

export interface CreatePaginationReturnValue {
  range: Accessor<(number | 'dots')[]>;
  active: Accessor<number>;
  setPage: (page: number) => void;
  next: () => void;
  previous: () => void;
  first: () => void;
  last: () => void;
}

export function createPagination({
  total,
  siblings = 1,
  boundaries = 1,
  page,
  initialPage = 1,
  onChange,
}: CreatePaginationOptions): CreatePaginationReturnValue {
  const _total = Math.max(Math.trunc(total), 0);
  const [activePage, setActivePage] = createSignal(page ?? initialPage);

  const setPage = (pageNumber: number) => {
    const clamped = pageNumber <= 0 ? 1 : pageNumber > _total ? _total : pageNumber;
    setActivePage(clamped);
    onChange?.(clamped);
  };

  const next = () => setPage(activePage() + 1);
  const previous = () => setPage(activePage() - 1);
  const first = () => setPage(1);
  const last = () => setPage(_total);

  const range = createMemo((): (number | 'dots')[] => {
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;
    if (totalPageNumbers >= _total) {
      return paginationRange(1, _total);
    }

    const leftSiblingIndex = Math.max(activePage() - siblings, boundaries);
    const rightSiblingIndex = Math.min(activePage() + siblings, _total - boundaries);

    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
    const shouldShowRightDots = rightSiblingIndex < _total - (boundaries + 1);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2;
      return [...paginationRange(1, leftItemCount), DOTS, ...paginationRange(_total - (boundaries - 1), _total)];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + 2 * siblings;
      return [...paginationRange(1, boundaries), DOTS, ...paginationRange(_total - rightItemCount, _total)];
    }

    return [
      ...paginationRange(1, boundaries),
      DOTS,
      ...paginationRange(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...paginationRange(_total - boundaries + 1, _total),
    ];
  });

  return { range, active: activePage, setPage, next, previous, first, last };
}
