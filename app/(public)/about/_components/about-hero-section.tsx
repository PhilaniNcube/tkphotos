import * as React from "react";
import { Camera, Sun } from "lucide-react";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet, type PhotoRow } from "@/lib/media";
import { photoSrc } from "@/lib/utils";

interface AboutHeroSectionProps {
  portrait: PhotoRow | null;
}

export function AboutHeroSection({ portrait }: AboutHeroSectionProps) {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-12 lg:px-12 lg:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-5">
          <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-container-high shadow-xl">
            <R2Image
              src={portrait ? photoSrc(portrait, "medium") : null}
              srcSet={portrait ? photoSrcSet(portrait) : undefined}
              sizes="(max-width: 1024px) 100vw, 40vw"
              alt="Portrait of Thandikaya Matokazi, Founder of TK Media"
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 -mt-12 ml-6 max-w-xs rounded-xl bg-surface-container-lowest p-5 shadow-lg lg:-mr-8">
            <div className="mb-1 flex items-center justify-between gap-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                Founder &amp; Lead
              </span>
              <span className="h-2 w-2 rounded-full bg-tertiary-container" />
            </div>
            <p className="text-base font-bold text-on-surface">
              Thandikaya Matokazi
            </p>
            <p className="mt-0.5 text-xs text-on-surface-variant">
              Eastern Cape, South Africa &bull; Est. 2016
            </p>
          </div>


        </div>

        <div className="flex flex-col justify-center space-y-6 lg:col-span-7 lg:pl-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary-fixed px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-on-primary-fixed">
              About TK Media
            </span>

          </div>

          <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
            Documenting real moments with{" "}
            <span className="text-primary">natural light</span> and quiet
            precision.
          </h1>

          <div className="space-y-4 text-base leading-relaxed text-on-surface-variant lg:text-lg">
            <p>
              Based in the{" "}
              <strong className="font-semibold text-on-surface">
                Eastern Cape, South Africa
              </strong>
              , Thandikaya Matokazi brings over nine years of professional
              experience capturing human stories as they genuinely unfold, free
              from stiff posing or artificial staging.
            </p>
            <p>
              With a foundation in{" "}
              <strong className="font-semibold text-on-surface">
                Media Studies from the University of Fort Hare
              </strong>
              , every assignment blends documentary honesty with natural light
              first — spanning community milestones, weddings, sports &amp;
              action, corporate conferences, and brand storytelling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3">
              <Sun className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                  Primary Medium
                </p>
                <p className="text-sm font-semibold text-on-surface">
                  Natural Light First
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3">
              <Camera className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                  Discipline
                </p>
                <p className="text-sm font-semibold text-on-surface">
                  Documentary Coverage
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
