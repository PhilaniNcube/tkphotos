"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet } from "@/lib/media";
import type { HomepageExpertiseItem } from "@/lib/queries/editorial-media";
import { photoSrc } from "@/lib/utils";

interface ExpertiseShowcaseClientProps {
  items?: HomepageExpertiseItem[];
}

export function ExpertiseShowcaseClient({
  items = [],
}: ExpertiseShowcaseClientProps) {
  if (items.length === 0) return null;

  return (
    <section className="w-full bg-[#141218] py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Production Disciplines Built for Real Moments
          </h2>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-tertiary-fixed transition-colors hover:text-tertiary-fixed-dim"
          >
            <span>View all rates &amp; packages</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <Tabs
          defaultValue={items[0].id}
          orientation="vertical"
          className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10"
        >
          <TabsList
            aria-label="Photography and media disciplines"
            className="flex flex-col gap-2 border-0 border-e-0 border-b-0 p-0 lg:col-span-5"
          >
            {items.map((item) => (
              <TabsTab
                key={item.id}
                value={item.id}
                className="group m-0 flex h-auto w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-left text-white/75 transition-all hover:border-white/25 hover:bg-white/[0.05] hover:text-white data-[selected]:border-tertiary-fixed/50 data-[selected]:bg-white/[0.09] data-[selected]:text-white"
              >
                <span className="flex min-w-0 items-center gap-3.5">
                  <span className="font-mono text-xs font-semibold tracking-widest text-white/50 group-data-[selected]:text-tertiary-fixed">
                    {item.index}
                  </span>
                  <span className="truncate text-base font-medium sm:text-lg">
                    {item.title}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="hidden font-mono text-xs text-white/60 sm:inline">
                    {item.startingRate}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 opacity-40 transition-transform group-data-[selected]:translate-x-0.5 group-data-[selected]:-translate-y-0.5 group-data-[selected]:text-tertiary-fixed group-data-[selected]:opacity-100"
                    aria-hidden="true"
                  />
                </span>
              </TabsTab>
            ))}
          </TabsList>

          <div className="lg:col-span-7">
            {items.map((item) => (
              <TabsPanel
                key={item.id}
                value={item.id}
                className="p-0 ps-0 pt-0 focus-visible:outline-none"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <R2Image
                    src={item.photo ? photoSrc(item.photo, "medium") : null}
                    srcSet={item.photo ? photoSrcSet(item.photo) : undefined}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    alt={item.photo?.alt || item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141218]/80 via-transparent to-transparent" />
                  <Link
                    href={`/galleries/${item.gallerySlug}` as Route}
                    className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#141218]/65 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:border-tertiary-fixed/60 hover:text-tertiary-fixed"
                  >
                    <span>From {item.galleryTitle}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div className="max-w-xl">
                    <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                      {item.summary}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-center gap-2.5 text-sm text-white/90"
                        >
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-tertiary-fixed"
                            aria-hidden="true"
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <AppButton
                    variant="inverse"
                    size="md"
                    className="h-11 shrink-0 gap-2.5 rounded-full pl-5 pr-2"
                    render={
                      <Link
                        href={`/contact?service=${item.serviceParam}` as Route}
                      />
                    }
                  >
                    <span>Inquire</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-on-tertiary-fixed text-tertiary-fixed">
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </AppButton>
                </div>
              </TabsPanel>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
