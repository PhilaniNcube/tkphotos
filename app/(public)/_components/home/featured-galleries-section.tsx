import * as React from "react";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet } from "@/lib/media";
import { getHomepageGalleries } from "@/lib/queries/galleries";
import { cn, photoSrc } from "@/lib/utils";

export async function FeaturedGalleriesSection() {
  "use cache";
  cacheLife("days");
  cacheTag("homepage", "homepage-featured-galleries");

  const galleries = await getHomepageGalleries({
    gallerySlugs: [
      "berlin-november",
      "traditional-weddings",
      "music-in-the-snow",
    ],
    photosPerGallery: 1,
    includeMeta: true,
    fallbackToRecent: true,
  });

  if (galleries.length === 0) return null;

  return (
    <section className="w-full bg-surface-container-low py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end md:mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            Featured Galleries
          </h2>

          <Link
            href="/galleries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-container"
          >
            <span>Explore all galleries</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7">
          {galleries.map((gallery, index) => {
            const coverSrc =
              gallery.cover_image || photoSrc(gallery.photos[0], "medium");
            const coverSrcSet = gallery.photos[0]
              ? photoSrcSet(gallery.photos[0])
              : undefined;
            const href = `/galleries/${gallery.slug}` as Route;
            const year = gallery.event_date?.slice(0, 4);
            const isLead = index === 0;

            return (
              <Link
                key={gallery.id}
                href={href}
                className={cn(
                  "group relative w-full overflow-hidden rounded-2xl bg-surface-container shadow-md transition-all duration-300 hover:shadow-xl",
                  isLead
                    ? "aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[520px]"
                    : "aspect-[16/10] lg:col-span-5 lg:min-h-[246px]"
                )}
              >
                <R2Image
                  src={coverSrc}
                  srcSet={gallery.cover_image ? undefined : coverSrcSet}
                  sizes={
                    isLead
                      ? "(max-width: 1024px) 100vw, 58vw"
                      : "(max-width: 1024px) 100vw, 40vw"
                  }
                  alt={gallery.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141218]/92 via-[#141218]/35 to-transparent" />

                <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {year && (
                      <span className="rounded-full border border-white/20 bg-[#141218]/55 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                        {year}
                      </span>
                    )}
                    {typeof gallery.photo_count === "number" &&
                      gallery.photo_count > 0 && (
                        <span className="rounded-full border border-white/20 bg-[#141218]/55 px-3 py-1 font-mono text-[11px] font-medium text-tertiary-fixed backdrop-blur-md">
                          {gallery.photo_count} frames
                        </span>
                      )}
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#141218]/55 text-white backdrop-blur-md transition-colors group-hover:border-tertiary-fixed group-hover:bg-tertiary-fixed group-hover:text-on-tertiary-fixed">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3
                    className={cn(
                      "mb-1 font-bold text-white",
                      isLead ? "text-2xl sm:text-3xl" : "text-xl"
                    )}
                  >
                    {gallery.title}
                  </h3>
                  {gallery.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                      {gallery.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturedGalleriesFallback() {
  return (
    <section
      aria-hidden="true"
      className="w-full bg-surface-container-low py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl animate-pulse px-6 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end md:mb-12">
          <div className="h-10 w-64 rounded-xl bg-surface-container" />
          <div className="h-5 w-40 rounded-lg bg-surface-container" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7">
          <div className="aspect-[4/3] w-full rounded-2xl bg-surface-container lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[520px]" />
          <div className="aspect-[16/10] w-full rounded-2xl bg-surface-container lg:col-span-5 lg:min-h-[246px]" />
          <div className="aspect-[16/10] w-full rounded-2xl bg-surface-container lg:col-span-5 lg:min-h-[246px]" />
        </div>
      </div>
    </section>
  );
}
