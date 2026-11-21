"use client";

import * as React from "react";
import Link from "next/link";
import { Toggle } from "@ui-sdk/react/toggle";
import { ArrowLeft, Download, Heart } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import type { GalleryWithPhotos } from "@/lib/queries/galleries";
import { cn } from "@/lib/utils";

interface GalleryDetailHeaderSectionProps {
  gallery: GalleryWithPhotos;
  favoritesCount: number;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (pressed: boolean) => void;
  onDownloadAll: () => void;
}

function formatDate(raw: string | null): string {
  if (!raw) return "Archive";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "Archive";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function GalleryDetailHeaderSection({
  gallery,
  favoritesCount,
  favoritesOnly,
  onFavoritesOnlyChange,
  onDownloadAll,
}: GalleryDetailHeaderSectionProps) {
  const category = gallery.collections?.[0]?.name || "Public Gallery";

  return (
    <section className="w-full border-b border-outline-variant/50 bg-surface-container-low py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/galleries"
            className="group inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>Back to Galleries</span>
          </Link>
          <span className="hidden font-mono text-xs uppercase tracking-widest text-on-surface-variant sm:inline">
            TK-MEDIA / {gallery.slug.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-secondary-container">
                {category}
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                {formatDate(gallery.event_date || gallery.created_at)}
              </span>
              <span className="text-on-surface-variant/40">&bull;</span>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                {gallery.photos.length}{" "}
                {gallery.photos.length === 1 ? "Photo" : "Photos"}
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-[1.1] tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
              {gallery.title}
            </h1>

            {gallery.description && (
              <p className="max-w-2xl whitespace-pre-line text-base leading-relaxed text-on-surface-variant lg:text-lg">
                {gallery.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
            <Toggle
              pressed={favoritesOnly}
              onPressedChange={onFavoritesOnlyChange}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-sm transition-colors cursor-pointer",
                favoritesOnly
                  ? "border-primary bg-primary text-on-primary hover:bg-primary-container"
                  : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  favoritesOnly ? "fill-on-primary text-on-primary" : "text-primary"
                )}
                aria-hidden="true"
              />
              <span>Client Favorites</span>
              <span
                className={cn(
                  "ml-1 rounded-full px-2 py-0.5 font-mono text-xs font-semibold",
                  favoritesOnly
                    ? "bg-on-primary/20 text-on-primary"
                    : "bg-primary-fixed text-on-primary-fixed"
                )}
              >
                {favoritesCount}
              </span>
            </Toggle>

            <AppButton variant="primary" size="md" onClick={onDownloadAll}>
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download All</span>
            </AppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
