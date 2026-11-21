"use client";

import * as React from "react";
import type { CollectionShowcaseRow } from "@/lib/queries/collections";
import { CollectionsGridSection } from "./collections-grid-section";
import {
  CollectionsHeaderSection,
  type CollectionThemeFilter,
} from "./collections-header-section";
import { PrivateClientAccessSection } from "./private-client-access-section";

interface CollectionsBrowserProps {
  collections: CollectionShowcaseRow[];
}

function classifyCollection(slug: string): {
  group: Exclude<CollectionThemeFilter, "all">;
  badge: string;
} {
  if (slug === "sports") {
    return { group: "sports", badge: "Sports" };
  }
  if (
    slug === "weddings" ||
    slug === "birthdays" ||
    slug === "matric-dance" ||
    slug === "awards-shows"
  ) {
    return {
      group: "celebrations",
      badge: slug === "matric-dance" ? "Milestones" : "Celebrations",
    };
  }
  return {
    group: "nature-documentary",
    badge: slug === "nature" ? "Nature" : "Documentary",
  };
}

export function CollectionsBrowser({ collections }: CollectionsBrowserProps) {
  const [theme, setTheme] = React.useState<CollectionThemeFilter>("all");

  const annotated = React.useMemo(
    () =>
      collections.map((c) => {
        const meta = classifyCollection(c.slug);
        return {
          ...c,
          themeGroup: meta.group,
          themeBadge: meta.badge,
        };
      }),
    [collections]
  );

  const visibleCollections = React.useMemo(() => {
    if (theme === "all") return annotated;
    return annotated.filter((c) => c.themeGroup === theme);
  }, [annotated, theme]);

  return (
    <div className="flex w-full flex-col">
      <CollectionsHeaderSection
        totalCollections={collections.length}
        selectedTheme={theme}
        onThemeChange={setTheme}
      />
      <CollectionsGridSection collections={visibleCollections} />
      <PrivateClientAccessSection />
    </div>
  );
}
