"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Camera } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { MEDIA_SIZE_WIDTHS, type GalleryRow, type MediaSizeName } from "@/lib/media";

interface GalleriesGridSectionProps {
  galleries: GalleryRow[];
  isLoading?: boolean;
  onResetFilter?: () => void;
}

function formatDateLabel(raw: string | null): string {
  if (!raw) return "Archive";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "Archive";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .toUpperCase();
}

function buildCoverSrcSet(gallery: GalleryRow): string | undefined {
  if (!gallery.cover_sizes) return undefined;
  const entries = (Object.keys(MEDIA_SIZE_WIDTHS) as MediaSizeName[])
    .map((name) => {
      const size = gallery.cover_sizes?.[name];
      return size?.url && size.width ? `${size.url} ${size.width}w` : null;
    })
    .filter(Boolean) as string[];
  return entries.length > 0 ? entries.join(", ") : undefined;
}

export function GalleriesGridSection({
  galleries,
  isLoading = false,
  onResetFilter,
}: GalleriesGridSectionProps) {
  if (galleries.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-12">
        <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-on-surface">
            No public galleries found
          </h2>
          <p className="mt-1 max-w-sm text-sm text-on-surface-variant">
            No galleries matched this category filter. Try viewing all public
            archives instead.
          </p>
          {onResetFilter && (
            <AppButton
              variant="primary"
              size="sm"
              className="mt-5"
              onClick={onResetFilter}
            >
              Show All Galleries
            </AppButton>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-busy={isLoading || undefined}
      className="mx-auto w-full max-w-7xl px-6 pb-10 lg:px-12"
    >
      <div
        className={`grid grid-cols-1 gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-4 ${
          isLoading ? "opacity-60" : "opacity-100"
        }`}
      >
        {galleries.map((gallery) => {
          const href = `/galleries/${gallery.slug}` as Route;
          const badge = gallery.collections?.[0]?.name || "Gallery";
          const coverSrc =
            gallery.cover_sizes?.thumbnail?.url || gallery.cover_image;
          const coverSrcSet = buildCoverSrcSet(gallery);
          const photoCount = gallery.photo_count ?? 0;

          return (
            <Link
              key={gallery.id}
              href={href}
              className="group flex w-full flex-col overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-low shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container-highest">
                <R2Image
                  src={coverSrc}
                  srcSet={coverSrcSet}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  alt={gallery.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-on-surface backdrop-blur-md">
                  {badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-on-surface-variant">
                    {formatDateLabel(gallery.event_date || gallery.created_at)}
                  </span>
                  <span className="font-mono text-xs font-semibold text-primary">
                    {photoCount} {photoCount === 1 ? "PHOTO" : "PHOTOS"}
                  </span>
                </div>

                <h2 className="mb-1.5 line-clamp-1 text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                  {gallery.title}
                </h2>

                <p className="mb-4 line-clamp-2 flex-1 text-sm text-on-surface-variant">
                  {gallery.description ||
                    "Curated photography gallery from the TK Media archive."}
                </p>

                <div className="flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    View Gallery
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
