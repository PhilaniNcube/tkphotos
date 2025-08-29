"use client";

import { useState, useEffect } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { getGalleriesPaginatedClient } from "@/lib/queries/galleries-client";
import type { GalleryRow } from "@/lib/queries/galleries";
import { PublicGalleriesGrid } from "./public-galleries-grid";
import { GalleryPagination } from "./gallery-pagination";

interface GalleriesClientProps {
  initialData: GalleryRow[];
  initialPage: number;
  initialPageCount: number;
  initialHasMore: boolean;
}

export function GalleriesClient({
  initialData,
  initialPage,
  initialPageCount,
  initialHasMore,
}: GalleriesClientProps) {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [galleries, setGalleries] = useState(initialData);
  const [pageCount, setPageCount] = useState(initialPageCount);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If page changes, fetch new data
    if (page !== initialPage) {
      fetchGalleries(page);
    }
  }, [page, initialPage]);

  const fetchGalleries = async (newPage: number) => {
    setIsLoading(true);
    try {
      const pageSize = 24;
      const {
        data,
        pageCount: newPageCount,
        hasMore: newHasMore,
      } = await getGalleriesPaginatedClient({
        page: newPage,
        pageSize,
        publicOnly: true,
        orderBy: "created_at",
        ascending: false,
      });

      setGalleries(data);
      setPageCount(newPageCount);
      setHasMore(newHasMore);
    } catch (error) {
      console.error("Failed to fetch galleries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div
        className={`transition-opacity duration-200 ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        <PublicGalleriesGrid galleries={galleries} />
      </div>

      {isLoading && (
        <div className="text-center text-sm text-muted-foreground">
          Loading galleries...
        </div>
      )}

      <GalleryPagination
        currentPage={page}
        pageCount={pageCount}
        hasMore={hasMore}
      />
    </div>
  );
}
