import * as React from "react";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet } from "@/lib/media";
import { getHomepageFeaturedWork } from "@/lib/queries/editorial-media";
import { cn, photoSrc } from "@/lib/utils";

export async function FeaturedWorkSection() {
  "use cache";
  cacheLife("days");
  cacheTag("homepage", "homepage-featured-work");

  const photos = await getHomepageFeaturedWork();
  if (photos.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24 lg:px-12">
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Featured Work
        </h2>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <p className="max-w-md text-sm leading-relaxed text-on-surface-variant md:text-right">
            A curated selection of recent commissions — from intimate cultural
            ceremonies to live concerts and weekend lifestyle features.
          </p>
          <Link
            href="/galleries"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-container"
          >
            <span>Explore full archive</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
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
                "group relative w-[74vw] max-w-[290px] shrink-0 snap-center overflow-hidden rounded-2xl bg-surface-container shadow-md transition-all duration-500 hover:shadow-xl md:w-full md:max-w-none",
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
              <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#141218]/55 text-white backdrop-blur-md transition-all duration-300 group-hover:border-tertiary-fixed group-hover:bg-tertiary-fixed group-hover:text-on-tertiary-fixed">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#141218]/92 via-[#141218]/30 to-transparent p-5 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                <span className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-tertiary-fixed">
                  {photo.gallery_title || "Selected Frame"}
                </span>
                <p className="line-clamp-2 text-sm font-medium text-white sm:text-base">
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

export function FeaturedWorkFallback() {
  return (
    <section
      aria-hidden="true"
      className="mx-auto w-full max-w-7xl animate-pulse px-6 py-16 md:py-24 lg:px-12"
    >
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
        <div className="h-10 w-56 rounded-xl bg-surface-container" />
        <div className="h-12 w-80 max-w-full rounded-xl bg-surface-container" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "aspect-[4/5] w-full rounded-2xl bg-surface-container",
              index === 1 && "md:mt-8"
            )}
          />
        ))}
      </div>
    </section>
  );
}
