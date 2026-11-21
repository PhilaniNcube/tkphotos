"use client";

import * as React from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet, type PhotoRow } from "@/lib/media";
import { photoSrc } from "@/lib/utils";

interface HeroCarouselSectionProps {
  photos: PhotoRow[];
}

export function HeroCarouselSection({ photos }: HeroCarouselSectionProps) {
  const hasPhotos = photos.length > 0;

  return (
    <section className="relative w-full overflow-hidden bg-inverse-surface text-on-primary">
      <Carousel
        aria-label="TK Media featured photography showcase"
        loop
        defaultPlaying={photos.length > 1}
        interval={5500}
        className="relative block w-full max-w-none"
      >
        <CarouselViewport className="w-full h-[76svh] min-h-[500px] max-h-[820px] md:h-[calc(100svh-4rem)] md:min-h-[620px] overflow-hidden">
          <CarouselContent className="flex h-full gap-0">
            {hasPhotos ? (
              photos.map((photo, index) => (
                <CarouselItem
                  key={photo.id}
                  aria-label={`Hero photograph ${index + 1} of ${photos.length}`}
                  className="relative h-full w-full basis-full shrink-0"
                >
                  <R2Image
                    src={photoSrc(photo, "full")}
                    srcSet={photoSrcSet(photo)}
                    sizes="100vw"
                    alt={photo.alt || photo.caption || "TK Media Portfolio"}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : undefined}
                    className="h-full w-full object-cover object-center"
                  />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem
                aria-label="TK Media Portfolio"
                className="relative h-full w-full basis-full shrink-0 bg-gradient-to-br from-inverse-surface via-primary to-on-surface"
              />
            )}
          </CarouselContent>
        </CarouselViewport>

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-on-surface/65 via-on-surface/45 to-on-surface/85" />

        <div className="pointer-events-none absolute inset-0 z-20 mx-auto flex max-w-4xl flex-col items-center justify-center px-6 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-on-primary/20 bg-on-surface/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-tertiary-fixed backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed" />
            Eastern Cape &amp; South Africa
          </span>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-on-primary sm:text-6xl lg:text-8xl">
            TK Media
          </h1>
          <p className="mb-4 text-base font-medium tracking-wide text-primary-fixed sm:text-2xl">
            Event Photography &amp; Videography
          </p>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-inverse-on-surface/90 sm:text-base">
            Authentic visual storytelling across the Eastern Cape &amp; South
            Africa — capturing moments with natural light, documentary
            precision, and timeless craft.
          </p>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <AppButton
              variant="inverse"
              size="lg"
              render={<Link href="/galleries" />}
            >
              <span>Explore Galleries</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </AppButton>
            <AppButton
              variant="inverseOutline"
              size="lg"
              render={<Link href="/contact" />}
            >
              Book a Session
            </AppButton>
          </div>
        </div>

        {photos.length > 1 && (
          <>
            <CarouselPrevious
              aria-label="Previous slide"
              className="hidden md:inline-flex absolute left-6 top-1/2 z-30 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-on-primary/25 bg-on-surface/50 p-0 text-on-primary backdrop-blur-md hover:bg-on-surface/80 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </CarouselPrevious>
            <CarouselNext
              aria-label="Next slide"
              className="hidden md:inline-flex absolute right-6 top-1/2 z-30 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-on-primary/25 bg-on-surface/50 p-0 text-on-primary backdrop-blur-md hover:bg-on-surface/80 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </CarouselNext>

            <div className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-center gap-3 px-4">
              <CarouselIndicatorGroup
                aria-label="Choose a hero slide"
                className="flex items-center gap-2 rounded-full bg-on-surface/55 px-3.5 py-2 backdrop-blur-md"
              >
                {photos.map((photo, index) => (
                  <CarouselIndicator
                    key={photo.id}
                    page={index + 1}
                    aria-label={`Slide ${index + 1}`}
                    className="h-2 w-2 rounded-full border-0 bg-on-primary/50 p-0 transition-all duration-300 hover:bg-on-primary data-[selected]:w-7 data-[selected]:bg-tertiary-fixed cursor-pointer"
                  />
                ))}
              </CarouselIndicatorGroup>
              <CarouselPlayToggle className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-on-primary/25 bg-on-surface/55 p-0 text-on-primary backdrop-blur-md hover:bg-on-surface/80 cursor-pointer">
                {(state) => (
                  <>
                    {state.playing ? (
                      <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {state.playing ? "Pause slideshow" : "Play slideshow"}
                    </span>
                  </>
                )}
              </CarouselPlayToggle>
            </div>
          </>
        )}
      </Carousel>
    </section>
  );
}
