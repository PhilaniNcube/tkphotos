import { useQueryState, parseAsInteger } from "nuqs";

export function usePagination(defaultPage: number = 1) {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(defaultPage)
  );

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const goToNextPage = (currentPage: number, maxPage: number) => {
    const nextPage = Math.min(currentPage + 1, maxPage);
    setPage(nextPage);
  };

  const goToPreviousPage = (currentPage: number) => {
    const prevPage = Math.max(currentPage - 1, 1);
    setPage(prevPage);
  };

  const resetToFirstPage = () => {
    setPage(1);
  };

  return {
    page,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetToFirstPage,
  };
}
