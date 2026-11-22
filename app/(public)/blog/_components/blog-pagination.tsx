import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface BlogPaginationProps {
  page: number;
  pageCount: number;
}

export function BlogPagination({ page, pageCount }: BlogPaginationProps) {
  if (pageCount <= 1) return null;

  const previousHref = (page > 2 ? `/blog?page=${page - 1}` : "/blog") as Route;
  const nextHref = `/blog?page=${page + 1}` as Route;

  return (
    <nav
      aria-label="Blog pagination"
      className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 pb-16 lg:px-12"
    >
      {page > 1 ? (
        <Link
          href={previousHref}
          rel="prev"
          className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary/40 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Newer posts</span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      <span className="font-mono text-xs text-on-surface-variant">
        Page {page} of {pageCount}
      </span>

      {page < pageCount ? (
        <Link
          href={nextHref}
          rel="next"
          className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary/40 hover:text-primary"
        >
          <span>Older posts</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
