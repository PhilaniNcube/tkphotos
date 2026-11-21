"use client";

import * as React from "react";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/react/pagination";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface GalleriesPaginationSectionProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function GalleriesPaginationSection({
  currentPage,
  pageCount,
  onPageChange,
  disabled = false,
}: GalleriesPaginationSectionProps) {
  if (pageCount <= 1) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-4 lg:px-12">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant/50 pt-6 sm:flex-row">
        <p className="font-mono text-sm text-on-surface-variant">
          Page <span className="font-semibold text-on-surface">{currentPage}</span>{" "}
          of <span className="font-semibold text-on-surface">{pageCount}</span>
        </p>

        <Pagination
          aria-label="Galleries pagination"
          page={currentPage}
          pageCount={pageCount}
          disabled={disabled}
          onPageChange={(nextPage) => onPageChange(nextPage)}
        >
          <PaginationList className="flex flex-wrap items-center gap-1.5">
            {({ items }) => (
              <>
                <PaginationItem>
                  <PaginationPrevious className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 text-sm font-medium text-on-surface hover:bg-surface-container data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 cursor-pointer">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only">Previous</span>
                  </PaginationPrevious>
                </PaginationItem>

                {items.map((item) => (
                  <PaginationItem key={item}>
                    {typeof item === "number" ? (
                      <PaginationLink
                        page={item}
                        className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-3 font-mono text-sm font-semibold text-on-surface hover:bg-surface-container data-[current]:border-primary data-[current]:bg-primary data-[current]:text-on-primary cursor-pointer"
                      />
                    ) : (
                      <PaginationEllipsis className="inline-flex h-10 w-8 items-center justify-center text-on-surface-variant" />
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 text-sm font-medium text-on-surface hover:bg-surface-container data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 cursor-pointer">
                    <span className="sr-only sm:not-sr-only">Next</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </PaginationNext>
                </PaginationItem>
              </>
            )}
          </PaginationList>
        </Pagination>
      </div>
    </section>
  );
}
