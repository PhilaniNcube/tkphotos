import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet } from "@/lib/media";
import type { GalleryWithPhotos } from "@/lib/queries/galleries";
import { photoSrc } from "@/lib/utils";

interface FeaturedGalleriesSectionProps {
  galleries: GalleryWithPhotos[];
}

export function FeaturedGalleriesSection({
  galleries,
}: FeaturedGalleriesSectionProps) {
  if (galleries.length === 0) return null;

  return (
    <section className="w-full bg-surface-container-low py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end md:mb-12">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-xs font-semibold tracking-widest text-primary">
                02
              </span>
              <span className="h-0.5 w-8 bg-tertiary-container" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Curated Archives
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
              Featured Galleries
            </h2>
          </div>

          <Link
            href="/galleries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-container transition-colors"
          >
            <span>Explore all galleries</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {galleries.map((gallery) => {
            const coverSrc =
              gallery.cover_image || photoSrc(gallery.photos[0], "medium");
            const coverSrcSet = gallery.photos[0]
              ? photoSrcSet(gallery.photos[0])
              : undefined;
            const href = `/galleries/${gallery.slug}` as Route;

            return (
              <Link
                key={gallery.id}
                href={href}
                className="group relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-surface-container shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <R2Image
                  src={coverSrc}
                  srcSet={gallery.cover_image ? undefined : coverSrcSet}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt={gallery.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-on-surface/90 via-on-surface/35 to-transparent p-6">
                  <h3 className="mb-1 text-xl font-bold text-on-primary">
                    {gallery.title}
                  </h3>
                  {gallery.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-inverse-on-surface/90 sm:text-sm">
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
