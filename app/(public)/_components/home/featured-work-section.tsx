import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet, type PhotoRow } from "@/lib/media";
import { cn, photoSrc } from "@/lib/utils";

interface FeaturedWorkSectionProps {
  photos: PhotoRow[];
}

export function FeaturedWorkSection({ photos }: FeaturedWorkSectionProps) {
  if (photos.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24 lg:px-12">
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-xs font-semibold tracking-widest text-primary">
              01
            </span>
            <span className="h-0.5 w-8 bg-tertiary-container" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              Selected Frames
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            Featured Work
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
          A curated selection of recent commissions — from intimate cultural
          ceremonies to high-energy summits and coastal portraits.
        </p>
      </div>

      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
        {photos.map((photo, index) => {
          const href = (
            photo.gallery_slug ? `/galleries/${photo.gallery_slug}` : "/galleries"
          ) as Route;

          return (
            <Link
              key={photo.id}
              href={href}
              className={cn(
                "group relative w-[74vw] max-w-[290px] shrink-0 snap-center overflow-hidden rounded-xl bg-surface-container shadow-md transition-all duration-500 hover:shadow-xl md:w-full md:max-w-none",
                "aspect-[4/5]",
                index === 1 && "md:mt-8"
              )}
            >
              <R2Image
                src={photoSrc(photo, "medium")}
                srcSet={photoSrcSet(photo)}
                sizes="(max-width: 768px) 75vw, 33vw"
                alt={photo.alt || photo.caption || photo.filename}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-on-surface/90 via-on-surface/25 to-transparent p-5 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                <span className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-tertiary-fixed">
                  {photo.gallery_title || "Selected Frame"}
                </span>
                <p className="line-clamp-2 text-sm font-medium text-on-primary sm:text-base">
                  {photo.caption || photo.alt || photo.filename}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
