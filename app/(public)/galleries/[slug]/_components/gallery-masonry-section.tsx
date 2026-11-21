"use client";

import * as React from "react";
import { Button as UiButton } from "@ui-sdk/react/button";
import { Toggle } from "@ui-sdk/react/toggle";
import { Camera, Expand, Filter, Heart } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet, type PhotoRow } from "@/lib/media";
import { cn, photoSrc } from "@/lib/utils";

interface GalleryMasonrySectionProps {
  photos: PhotoRow[];
  totalCount: number;
  favoritesOnly: boolean;
  favoriteIds: Set<string>;
  onToggleFavorite: (photoId: string) => void;
  onOpenLightbox: (photoId: string) => void;
  onClearFavoritesFilter: () => void;
}

export function GalleryMasonrySection({
  photos,
  totalCount,
  favoritesOnly,
  favoriteIds,
  onToggleFavorite,
  onOpenLightbox,
  onClearFavoritesFilter,
}: GalleryMasonrySectionProps) {
  return (
    <section className="w-full py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {favoritesOnly && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-secondary-container/70 p-4 text-on-secondary-container">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" aria-hidden="true" />
              <span>
                Showing {photos.length} Client{" "}
                {photos.length === 1 ? "Favorite" : "Favorites"}
              </span>
            </div>
            <AppButton
              variant="outline"
              size="sm"
              onClick={onClearFavoritesFilter}
            >
              Show All {totalCount} Photos
            </AppButton>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-on-surface">
              {favoritesOnly
                ? "No client favorites selected yet"
                : "No photos in this gallery yet"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-on-surface-variant">
              {favoritesOnly
                ? "Use the heart button on any photograph to shortlist your favorite frames."
                : "Check back soon for new images from this gallery."}
            </p>
            {favoritesOnly && (
              <AppButton
                variant="primary"
                size="sm"
                className="mt-5"
                onClick={onClearFavoritesFilter}
              >
                Show All {totalCount} Photos
              </AppButton>
            )}
          </div>
        ) : (
          <div className="columns-1 gap-4 space-y-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
            {photos.map((photo) => {
              const label = photo.caption || photo.alt || photo.filename;
              const isFavorite = favoriteIds.has(photo.id);
              const meta =
                photo.width && photo.height
                  ? `${photo.width} × ${photo.height}`
                  : photo.filename;

              return (
                <div
                  key={photo.id}
                  className="group relative break-inside-avoid overflow-hidden rounded-xl bg-surface-container shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                  <UiButton
                    type="button"
                    onClick={() => onOpenLightbox(photo.id)}
                    aria-label={`Open ${label} in lightbox`}
                    className="block h-auto w-full rounded-none border-0 bg-transparent p-0 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <R2Image
                      src={photoSrc(photo, "thumbnail")}
                      srcSet={photoSrcSet(photo)}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      alt={label}
                      width={photo.sizes.thumbnail?.width ?? photo.width}
                      height={photo.sizes.thumbnail?.height ?? photo.height}
                      className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </UiButton>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-on-surface/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />

                  <div
                    className={cn(
                      "absolute right-3 top-3 z-10 flex items-center gap-1.5 transition-opacity duration-200",
                      isFavorite
                        ? "opacity-100"
                        : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                    )}
                  >
                    <Toggle
                      pressed={isFavorite}
                      onPressedChange={() => onToggleFavorite(photo.id)}
                      aria-label={
                        isFavorite
                          ? `Remove ${label} from favorites`
                          : `Favorite ${label}`
                      }
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-full border-0 p-0 shadow-sm backdrop-blur-md transition-transform hover:scale-110 cursor-pointer",
                        isFavorite
                          ? "bg-surface/95 text-error"
                          : "bg-surface/85 text-on-surface-variant hover:text-error"
                      )}
                    >
                      <Heart
                        className={cn("h-4 w-4", isFavorite && "fill-current")}
                        aria-hidden="true"
                      />
                    </Toggle>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-3 text-inverse-on-surface opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{label}</p>
                      <p className="truncate font-mono text-[10px] opacity-80">
                        {meta}
                      </p>
                    </div>
                    <Expand
                      className="h-4 w-4 shrink-0 opacity-85"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {photos.length > 0 && (
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-outline-variant/50 pt-8 text-xs text-on-surface-variant sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-high text-on-surface">
                <Expand className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>
                Select any photograph to open{" "}
                <strong className="font-semibold text-on-surface">
                  Lightbox Preview
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <kbd className="rounded bg-surface-container-high px-2 py-1 text-[11px] text-on-surface border-0">
                &larr;
              </kbd>
              <kbd className="rounded bg-surface-container-high px-2 py-1 text-[11px] text-on-surface border-0">
                &rarr;
              </kbd>
              <span className="mr-2">Navigate</span>
              <kbd className="rounded bg-surface-container-high px-2 py-1 text-[11px] text-on-surface border-0">
                ESC
              </kbd>
              <span>Close</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
