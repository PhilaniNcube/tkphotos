import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet } from "@/lib/media";
import type { ServicesHeroCard } from "@/lib/queries/editorial-media";
import { cn, photoSrc } from "@/lib/utils";

interface ServicesHeroSectionProps {
  cards: ServicesHeroCard[];
}

export function ServicesHeroSection({ cards }: ServicesHeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-surface px-6 py-16 lg:px-12 lg:py-24">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute right-12 top-12 h-40 w-40 rounded-full bg-tertiary-fixed/35 blur-2xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary-container px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-on-secondary-container">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          TK Media &bull; Services &amp; Rates
        </span>

        <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
          Crafted Visual Stories
        </h1>

        <p className="mb-10 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
          End-to-end photography, 4K videography, and structured media
          management designed to preserve moments, elevate brands, and deliver
          sharp results across the Eastern Cape and beyond.
        </p>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {cards.map((card, index) => {
            const href = `/galleries/${card.slug}` as Route;
            return (
              <Link
                key={card.label}
                href={href}
                className={cn(
                  "group relative h-44 overflow-hidden rounded-xl bg-surface-container shadow-md sm:h-52",
                  index === 1 && "sm:-mt-4"
                )}
              >
                <R2Image
                  src={card.photo ? photoSrc(card.photo, "medium") : null}
                  srcSet={card.photo ? photoSrcSet(card.photo) : undefined}
                  sizes="(max-width: 640px) 100vw, 260px"
                  alt={card.photo?.alt || card.label}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 via-on-surface/10 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-left text-xs font-semibold tracking-wide text-on-primary">
                  {card.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
