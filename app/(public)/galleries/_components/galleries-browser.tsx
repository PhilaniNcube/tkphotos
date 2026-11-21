"use client";

import * as React from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import type { CollectionRow, GalleryRow } from "@/lib/media";
import { getGalleriesPaginatedClient } from "@/lib/queries/galleries-client";
import { GalleriesGridSection } from "./galleries-grid-section";
import { GalleriesHeaderSection } from "./galleries-header-section";
import { GalleriesPaginationSection } from "./galleries-pagination-section";

interface GalleriesBrowserProps {
  initialData: GalleryRow[];
  initialTotal: number;
  initialPage: number;
  initialPageCount: number;
  initialCollection: string;
  collections: CollectionRow[];
}

const PAGE_SIZE = 12;

export function GalleriesBrowser({
  initialData,
  initialTotal,
  initialPage,
  initialPageCount,
  initialCollection,
  collections,
}: GalleriesBrowserProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [collection, setCollection] = useQueryState(
    "collection",
    parseAsString.withDefault("all")
  );

  const [galleries, setGalleries] = React.useState(initialData);
  const [total, setTotal] = React.useState(initialTotal);
  const [pageCount, setPageCount] = React.useState(initialPageCount);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadedKeyRef = React.useRef(`${initialPage}:${initialCollection}`);

  React.useEffect(() => {
    const targetKey = `${page}:${collection}`;
    if (targetKey === loadedKeyRef.current) return;

    let cancelled = false;
    setIsLoading(true);

    getGalleriesPaginatedClient({
      page,
      pageSize: PAGE_SIZE,
      publicOnly: true,
      collectionSlug: collection,
      includeMeta: true,
      orderBy: "created_at",
      ascending: false,
    })
      .then((res) => {
        if (cancelled) return;
        loadedKeyRef.current = targetKey;
        setGalleries(res.data);
        setTotal(res.total);
        setPageCount(res.pageCount);
      })
      .catch((error) => {
        console.error("Failed to load galleries:", error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, collection]);

  const handleCollectionChange = (slug: string) => {
    void setCollection(slug === "all" ? null : slug);
    void setPage(null);
  };

  const handlePageChange = (nextPage: number) => {
    void setPage(nextPage <= 1 ? null : nextPage);
  };

  return (
    <div className="flex w-full flex-col">
      <GalleriesHeaderSection
        collections={collections}
        selectedCollection={collection}
        onCollectionChange={handleCollectionChange}
        totalCount={total}
      />
      <GalleriesGridSection
        galleries={galleries}
        isLoading={isLoading}
        onResetFilter={
          collection !== "all" ? () => handleCollectionChange("all") : undefined
        }
      />
      <GalleriesPaginationSection
        currentPage={page}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        disabled={isLoading}
      />
    </div>
  );
}
