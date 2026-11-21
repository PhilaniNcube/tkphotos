import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Images } from "lucide-react";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet, type PhotoRow } from "@/lib/media";
import type { CollectionShowcaseRow } from "@/lib/queries/collections";
import { photoSrc } from "@/lib/utils";

interface CollectionsGridSectionProps {
  collections: Array<
    CollectionShowcaseRow & {
      themeBadge: string;
    }
  >;
}

function formatMonthYear(raw: string): string {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "Archive";
  return `Updated ${new Intl.DateTimeFormat("en-ZA", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)}`;
}

function PreviewCollage({
  photos,
  title,
}: {
  photos: PhotoRow[];
  title: string;
}) {
  if (photos.length === 0) {
    return (
      <div className="flex h-44 w-full items-center justify-center rounded-lg bg-surface-container text-xs text-on-surface-variant">
        Curated Galleries
      </div>
    );
  }

  if (photos.length === 1) {
    return (
      <div className="h-44 overflow-hidden rounded-lg bg-surface-container">
        <R2Image
          src={photoSrc(photos[0], "medium")}
          srcSet={photoSrcSet(photos[0])}
          sizes="(max-width: 768px) 100vw, 33vw"
          alt={photos[0].alt || title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  if (photos.length < 4) {
    return (
      <div className="grid h-44 grid-cols-3 gap-1.5 overflow-hidden rounded-lg">
        {photos.slice(0, 3).map((p, idx) => (
          <div
            key={p.id}
            className={
              idx === 0 && photos.length === 2
                ? "col-span-2 h-full overflow-hidden bg-surface-container"
                : "h-full overflow-hidden bg-surface-container"
            }
          >
            <R2Image
              src={photoSrc(p, "thumbnail")}
              srcSet={photoSrcSet(p)}
              sizes="(max-width: 768px) 50vw, 15vw"
              alt={p.alt || title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid h-44 grid-cols-4 gap-1.5 overflow-hidden rounded-lg">
      <div className="col-span-2 h-full overflow-hidden bg-surface-container">
        <R2Image
          src={photoSrc(photos[0], "medium")}
          srcSet={photoSrcSet(photos[0])}
          sizes="(max-width: 768px) 50vw, 20vw"
          alt={photos[0].alt || title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="col-span-1 h-full overflow-hidden bg-surface-container">
        <R2Image
          src={photoSrc(photos[1], "thumbnail")}
          srcSet={photoSrcSet(photos[1])}
          sizes="(max-width: 768px) 25vw, 12vw"
          alt={photos[1].alt || title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="col-span-1 flex h-full flex-col gap-1.5">
        <div className="h-1/2 overflow-hidden bg-surface-container">
          <R2Image
            src={photoSrc(photos[2], "thumbnail")}
            srcSet={photoSrcSet(photos[2])}
            sizes="(max-width: 768px) 25vw, 12vw"
            alt={photos[2].alt || title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="h-1/2 overflow-hidden bg-surface-container">
          <R2Image
            src={photoSrc(photos[3], "thumbnail")}
            srcSet={photoSrcSet(photos[3])}
            sizes="(max-width: 768px) 25vw, 12vw"
            alt={photos[3].alt || title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}

export function CollectionsGridSection({
  collections,
}: CollectionsGridSectionProps) {
  if (collections.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 pb-12 lg:px-12">
        <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-12 text-center text-sm text-on-surface-variant">
          No collections matched this theme filter.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-8 lg:px-12">
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => {
          const href = `/collections/${collection.slug}` as Route;
          return (
            <Link
              key={collection.id}
              href={href}
              className="group flex w-full flex-col overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-3 pb-0">
                <PreviewCollage
                  photos={collection.preview_photos}
                  title={collection.name}
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-md bg-primary-fixed px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-on-primary-fixed">
                    {collection.themeBadge}
                  </span>
                  <span className="text-xs font-medium text-on-surface-variant">
                    {formatMonthYear(collection.updated_at)}
                  </span>
                </div>

                <h2 className="mb-2 text-xl font-bold text-on-surface transition-colors group-hover:text-primary">
                  {collection.name}
                </h2>

                <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                  {collection.description ||
                    `Curated galleries highlighting ${collection.name.toLowerCase()} coverage by TK Media.`}
                </p>

                <div className="-mx-6 -mb-6 mt-auto flex items-center justify-between bg-surface-container-low px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
                    <Images
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                    <span>
                      {collection.gallery_count}{" "}
                      {collection.gallery_count === 1 ? "Gallery" : "Galleries"}{" "}
                      &middot; {collection.photo_count} Frames
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-transform group-hover:translate-x-1">
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
