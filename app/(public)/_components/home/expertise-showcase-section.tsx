import * as React from "react";
import { cacheLife, cacheTag } from "next/cache";
import { getHomepageExpertiseMedia } from "@/lib/queries/editorial-media";
import { ExpertiseShowcaseClient } from "./expertise-showcase-client";

export async function ExpertiseShowcaseSection() {
  "use cache";
  cacheLife("days");
  cacheTag("homepage", "homepage-expertise");

  const items = await getHomepageExpertiseMedia();
  return <ExpertiseShowcaseClient items={items} />;
}

export function ExpertiseShowcaseFallback() {
  return (
    <section
      aria-hidden="true"
      className="w-full bg-[#141218] py-20 text-white lg:py-28"
    >
      <div className="mx-auto max-w-7xl animate-pulse px-6 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="h-10 w-80 max-w-full rounded-xl bg-white/10" />
          <div className="h-5 w-44 rounded-lg bg-white/10" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-2 lg:col-span-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 w-full rounded-xl bg-white/[0.06]"
              />
            ))}
          </div>
          <div className="space-y-6 lg:col-span-7">
            <div className="aspect-[16/10] w-full rounded-2xl bg-white/10" />
            <div className="h-20 w-full rounded-xl bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </section>
  );
}
