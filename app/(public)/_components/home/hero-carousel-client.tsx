"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
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
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet } from "@/lib/media";
import type { HeroSlide } from "@/lib/queries/editorial-media";
import { cn, photoSrc } from "@/lib/utils";

interface HeroCarouselClientProps {
  slides?: HeroSlide[];
}

export function HeroCarouselClient({ slides = [] }: HeroCarouselClientProps) {
  const [page, setPage] = React.useState(1);
  const hasSlides = slides.length > 0;
  const activeIndex = hasSlides
    ? Math.min(Math.max(page - 1, 0), slides.length - 1)
    : 0;
  const activeSlide = hasSlides ? slides[activeIndex] : null;
  const totalLabel = String(Math.max(slides.length, 1)).padStart(2, "0");
  const currentLabel = String(activeIndex + 1).padStart(2, "0");
  const progressPercent = hasSlides
    ? ((activeIndex + 1) / slides.length) * 100
    : 100;

  return (
    <section className="w-full bg-surface px-2.5 pt-2.5 pb-4 sm:px-4 sm:pt-3 lg:px-6 lg:pt-4">
      <div className="relative mx-auto max-w-[1520px] overflow-hidden rounded-2xl bg-[#141218] text-on-primary shadow-2xl ring-1 ring-on-surface/10 lg:rounded-3xl">
        <Carousel
          aria-label="TK Media featured photography showcase"
          page={page}
          onPageChange={(next) => setPage(next)}
          slidesPerPage={1}
          loop
          defaultPlaying={slides.length > 1}
          interval={6000}
          className="relative block w-full max-w-none"
        >
          <CarouselViewport className="h-[80svh] min-h-[560px] max-h-[860px] w-full overflow-hidden md:h-[calc(100svh-5.75rem)] md:min-h-[640px]">
            <CarouselContent className="flex h-full gap-0">
              {hasSlides ? (
                slides.map((slide, index) => (
                  <CarouselItem
                    key={slide.id}
                    aria-label={`${slide.discipline} — ${slide.galleryTitle}`}
                    className="relative h-full w-full basis-full shrink-0"
                  >
                    <R2Image
                      src={photoSrc(slide.photo, "full")}
                      srcSet={photoSrcSet(slide.photo)}
                      sizes="(max-width: 1536px) 100vw, 1520px"
                      alt={slide.photo.alt || slide.caption}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : undefined}
                      className={cn(
                        "h-full w-full object-cover",
                        slide.objectPosition
                      )}
                    />
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem
                  aria-label="TK Media Portfolio"
                  className="relative h-full w-full basis-full shrink-0 bg-gradient-to-br from-[#141218] via-primary to-on-surface"
                />
              )}
            </CarouselContent>
          </CarouselViewport>

          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-[#141218]/92 via-[#141218]/48 to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#141218]/85 via-transparent to-[#141218]/35" />

          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="pointer-events-auto lg:col-span-7">
                {slides.length > 1 && (
                  <CarouselIndicatorGroup
                    aria-label="Choose a photography discipline"
                    className="mb-5 flex flex-wrap items-center gap-2"
                  >
                    {slides.map((slide, index) => (
                      <CarouselIndicator
                        key={slide.id}
                        page={index + 1}
                        className="relative h-auto w-auto cursor-pointer rounded-full border border-white/20 bg-[#141218]/45 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md transition-all hover:border-white/45 hover:text-white data-[selected]:border-tertiary-fixed data-[selected]:bg-tertiary-fixed data-[selected]:font-semibold data-[selected]:text-on-tertiary-fixed"
                      >
                        {slide.discipline}
                      </CarouselIndicator>
                    ))}
                  </CarouselIndicatorGroup>
                )}

                <h1 className="text-3xl font-medium leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
                  Capturing moments that{" "}
                  <span className="text-tertiary-fixed">stay long</span>{" "}
                  <span className="text-white/75">after the light fades.</span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                  Event photography, portraiture, and documentary
                  storytelling across the Eastern Cape &amp; South Africa.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <AppButton
                      variant="inverse"
                      size="lg"
                      className="h-12 gap-3 rounded-full pl-6 pr-2"
                      render={<Link href="/contact" />}
                    >
                      <span>Book a Session</span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-on-tertiary-fixed text-tertiary-fixed">
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </AppButton>
                    <AppButton
                      variant="inverseOutline"
                      size="lg"
                      className="h-12 rounded-full px-6"
                      render={<Link href="/galleries" />}
                    >
                      <span>Explore Galleries</span>
                    </AppButton>
                  </div>

                  {slides.length > 1 && (
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs tracking-widest text-white/85 tabular-nums">
                        {currentLabel} / {totalLabel}
                      </span>
                      <div
                        aria-hidden="true"
                        className="hidden h-px w-16 overflow-hidden bg-white/25 sm:block"
                      >
                        <div
                          className="h-full bg-tertiary-fixed transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <CarouselPrevious
                        aria-label="Previous slide"
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-[#141218]/50 p-0 text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-[#141218]/80"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      </CarouselPrevious>
                      <CarouselNext
                        aria-label="Next slide"
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-[#141218]/50 p-0 text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-[#141218]/80"
                      >
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </CarouselNext>
                      <CarouselPlayToggle className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-[#141218]/50 p-0 text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-[#141218]/80">
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
                  )}
                </div>
              </div>

              {activeSlide && (
                <div className="pointer-events-auto flex lg:col-span-5 lg:justify-end">
                  <Link
                    href={
                      (activeSlide.gallerySlug
                        ? `/galleries/${activeSlide.gallerySlug}`
                        : "/galleries") as Route
                    }
                    className="group flex w-full max-w-sm items-center gap-4 rounded-2xl border border-white/15 bg-[#141218]/65 p-3 text-left backdrop-blur-xl transition-all duration-300 hover:border-tertiary-fixed/50 hover:bg-[#141218]/80"
                  >
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white/10">
                      <R2Image
                        src={photoSrc(activeSlide.photo, "thumbnail")}
                        alt={activeSlide.galleryTitle}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white">
                        {activeSlide.galleryTitle}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-xs leading-snug text-white/70">
                        {activeSlide.caption}
                      </span>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors group-hover:border-tertiary-fixed group-hover:bg-tertiary-fixed group-hover:text-on-tertiary-fixed">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
