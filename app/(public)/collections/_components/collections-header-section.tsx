"use client";

import * as React from "react";
import { Layers } from "lucide-react";
import {
  FilterSegmentedControl,
  type SegmentedOption,
} from "@/components/ui-sdk/segmented-control";

export type CollectionThemeFilter =
  | "all"
  | "celebrations"
  | "sports"
  | "nature-documentary";

interface CollectionsHeaderSectionProps {
  totalCollections: number;
  selectedTheme: CollectionThemeFilter;
  onThemeChange: (theme: CollectionThemeFilter) => void;
}

export function CollectionsHeaderSection({
  totalCollections,
  selectedTheme,
  onThemeChange,
}: CollectionsHeaderSectionProps) {
  const options = React.useMemo<Array<SegmentedOption<CollectionThemeFilter>>>(
    () => [
      { value: "all", label: `All Collections (${totalCollections})` },
      { value: "celebrations", label: "Celebrations & Events" },
      { value: "sports", label: "Sports & Action" },
      { value: "nature-documentary", label: "Nature & Documentary" },
    ],
    [totalCollections]
  );

  return (
    <section className="relative w-full overflow-hidden px-6 pb-12 pt-14 lg:px-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary-container px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-on-secondary-container">
          <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>
            TK Media Archive &middot;{" "}
            {String(totalCollections).padStart(2, "0")} Themes
          </span>
        </div>

        <h1 className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
          Curated Collections
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
          Thematic groupings from across the Eastern Cape and beyond — bringing
          together celebrations, cultural heritage, nature, and kinetic sports
          chapters.
        </p>

        <div className="mt-8 flex justify-center">
          <FilterSegmentedControl
            ariaLabel="Filter collections by theme"
            options={options}
            value={selectedTheme}
            onValueChange={onThemeChange}
          />
        </div>
      </div>
    </section>
  );
}
