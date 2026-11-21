import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Camera } from "lucide-react";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet, type PhotoRow } from "@/lib/media";
import { photoSrc } from "@/lib/utils";

interface CollectionGallerySummary {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  created_at: string;
  photo_count: number;
}

interface CollectionGalleriesGridSectionProps {
  galleries: CollectionGallerySummary[];
  photosByGallery: Record<number, PhotoRow[]>;
}

function formatShortDate(raw: string | null): string {
  if (!raw) return "Archive";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "Archive";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function CollectionGalleriesGridSection({
  galleries,
  photosByGallery,
}: CollectionGalleriesGridSectionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-12 lg:py-16">
      {galleries.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-12 text-center text-sm text-on-surface-variant">
          No public galleries in this collection yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => {
            const photos = photosByGallery[gallery.id] || [];
            const href = `/galleries/${gallery.slug}` as Route;
            const totalCount = gallery.photo_count || photos.length;

            return (
              <Link
                key={gallery.id}
                href={href}
                className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-3 pb-0">
                  {photos.length === 0 ? (
                    <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
                      <Camera className="h-6 w-6 opacity-40" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="grid h-44 grid-cols-4 gap-1.5 overflow-hidden rounded-lg">
                      {photos.slice(0, 4).map((photo, idx) => (
                        <div
                          key={photo.id}
                          className={
                            photos.length <= 2 && idx === 0
                              ? "col-span-2 h-full overflow-hidden bg-surface-container"
                              : "h-full overflow-hidden bg-surface-container"
                          }
                        >
                          <R2Image
                            src={photoSrc(photo, "thumbnail")}
                            srcSet={photoSrcSet(photo)}
                            sizes="(max-width: 768px) 25vw, 15vw"
                            alt={photo.alt || gallery.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center justify-between font-mono text-xs text-on-surface-variant">
                    <span>
                      {formatShortDate(gallery.event_date || gallery.created_at)}
                    </span>
                    <span className="font-semibold text-primary">
                      {totalCount} {totalCount === 1 ? "PHOTO" : "PHOTOS"}
                    </span>
                  </div>

                  <h2 className="mb-1.5 line-clamp-1 text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                    {gallery.title}
                  </h2>

                  {gallery.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-on-surface-variant">
                      {gallery.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
                    <span>View Gallery</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
