"use client";

import * as React from "react";
import type { CollectionRow } from "@/lib/media";
import {
  FilterSegmentedControl,
  type SegmentedOption,
} from "@/components/ui-sdk/segmented-control";

interface GalleriesHeaderSectionProps {
  collections: CollectionRow[];
  selectedCollection: string;
  onCollectionChange: (slug: string) => void;
  totalCount: number;
}

export function GalleriesHeaderSection({
  collections,
  selectedCollection,
  onCollectionChange,
  totalCount,
}: GalleriesHeaderSectionProps) {
  const options = React.useMemo<Array<SegmentedOption<string>>>(
    () => [
      { value: "all", label: "All" },
      ...collections.map((c) => ({ value: c.slug, label: c.name })),
    ],
    [collections]
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-8 pt-12 text-center lg:px-12">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary-container px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-on-secondary-container">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span>Curated Archives &bull; {totalCount} Galleries</span>
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight text-on-surface md:text-5xl">
        Galleries
      </h1>

      <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
        Explore our latest visual stories across weddings, summits, athletic
        fixtures, and editorial portraiture.
      </p>

      {options.length > 1 && (
        <div className="flex justify-center">
          <FilterSegmentedControl
            ariaLabel="Filter galleries by collection"
            options={options}
            value={selectedCollection}
            onValueChange={onCollectionChange}
          />
        </div>
      )}
    </section>
  );
}
