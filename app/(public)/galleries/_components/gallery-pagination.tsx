"use client";

import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface GalleryPaginationProps {
  currentPage: number;
  pageCount: number;
  hasMore: boolean;
}

export function GalleryPagination({
  currentPage,
  pageCount,
  hasMore,
}: GalleryPaginationProps) {
  const { goToPage, goToNextPage, goToPreviousPage } = usePagination(1);

  const generatePageNumbers = () => {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
      .filter((p) => {
        if (p === 1 || p === pageCount) return true;
        if (Math.abs(p - currentPage) <= 1) return true;
        return false;
      })
      .reduce<number[]>((acc, p) => {
        if (acc.length === 0) return [p];
        const prev = acc[acc.length - 1];
        if (p - prev === 1) return [...acc, p];
        return [...acc, -1, p];
      }, []);
  };

  if (pageCount <= 1) {
    return (
      <div className="text-center text-xs text-muted-foreground">
        No more pages
      </div>
    );
  }

  return (
    <Pagination className="pt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPreviousPage(currentPage)}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {generatePageNumbers().map((p, idx) => {
          if (p === -1) {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => goToPage(p)}
                isActive={p === currentPage}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => goToNextPage(currentPage, pageCount)}
            aria-disabled={!hasMore}
            className={
              !hasMore
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
