import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

interface CollectionDetailHeaderSectionProps {
  name: string;
  description: string | null;
  createdAt: string;
  galleryCount: number;
}

export function CollectionDetailHeaderSection({
  name,
  description,
  createdAt,
  galleryCount,
}: CollectionDetailHeaderSectionProps) {
  const formattedDate = new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(createdAt));

  return (
    <section className="w-full border-b border-outline-variant/50 bg-surface-container-low py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/collections"
            className="group inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>All Collections</span>
          </Link>
          <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
            {formattedDate}
          </span>
        </div>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-secondary-container">
            <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>
              Collection &middot; {galleryCount}{" "}
              {galleryCount === 1 ? "Gallery" : "Galleries"}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-on-surface sm:text-5xl">
            {name}
          </h1>

          {description && (
            <p className="whitespace-pre-line text-base leading-relaxed text-on-surface-variant sm:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
