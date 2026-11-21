import * as React from "react";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet, type PhotoRow } from "@/lib/media";
import { photoSrc } from "@/lib/utils";

interface PhilosophyAndPracticeSectionProps {
  editorialPhoto: PhotoRow | null;
}

const principles = [
  {
    number: "01",
    title: "Documentary Foundations",
    description:
      "Unobtrusive coverage capturing unscripted emotion, authentic gestures, and the genuine atmosphere of your day.",
    highlight: false,
  },
  {
    number: "02",
    title: "Natural Light First",
    description:
      "Harnessing available ambient and golden-hour light to preserve true skin tones, depth, and organic mood.",
    highlight: false,
  },
  {
    number: "03",
    title: "Collaborative Planning",
    description:
      "Clear pre-shoot timelines, location logistics, and shot-list alignment so the day flows effortlessly.",
    highlight: false,
  },
  {
    number: "04",
    title: "Technical Consistency",
    description:
      "Calibrated color science, redundant dual-card backups, sharpness discipline, and cohesive gallery editing.",
    highlight: false,
  },
  {
    number: "05",
    title: "Efficient Delivery",
    description:
      "Organized galleries, practical licensing guidance, and same-day selects for press and social channels.",
    highlight: true,
    badge: "Same-Day Selects",
  },
];

export function PhilosophyAndPracticeSection({
  editorialPhoto,
}: PhilosophyAndPracticeSectionProps) {
  return (
    <section className="mt-8 w-full bg-surface-container-low px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-8 lg:col-span-7">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              02 / Philosophy
            </span>
            <h2 className="mt-2 text-2xl font-bold text-on-surface sm:text-3xl">
              Approach &amp; Values
            </h2>
            <p className="mt-2 max-w-xl text-sm text-on-surface-variant">
              Five core principles guide every frame from initial consultation to
              final gallery delivery.
            </p>
          </div>

          <div className="space-y-4">
            {principles.map((p) => (
              <div
                key={p.number}
                className="group flex items-start gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div
                  className={
                    p.highlight
                      ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tertiary-fixed font-mono text-sm font-bold text-on-tertiary-fixed transition-colors group-hover:bg-tertiary group-hover:text-on-tertiary"
                      : "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed font-mono text-sm font-bold text-on-primary-fixed transition-colors group-hover:bg-primary group-hover:text-on-primary"
                  }
                >
                  {p.number}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-on-surface">
                      {p.title}
                    </h3>
                    {p.badge && (
                      <span className="rounded-full bg-tertiary-fixed px-2.5 py-0.5 font-mono text-[11px] font-semibold text-on-tertiary-fixed">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 lg:col-span-5 lg:mt-12">
          <div className="space-y-5 rounded-xl bg-surface-container-high p-8">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              03 / Practice
            </span>
            <h2 className="text-2xl font-bold text-on-surface">
              Services In Context
            </h2>
            <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">
              My service range has grown organically from community roots —
              covering local sports fixtures, university events, and family
              gatherings — into supporting{" "}
              <strong className="font-semibold text-on-surface">
                conferences, brands, and media partners
              </strong>{" "}
              across South Africa.
            </p>
            <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">
              A structured media management workflow underpins everything:
              redundant backups, metadata discipline, and flexible turnaround so
              your visual assets retain long-term value.
            </p>

            <div className="pt-4">
              <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-on-surface-variant">
                <span>PLANNING</span>
                <span>CAPTURE</span>
                <span>SELECTS</span>
                <span>ARCHIVE</span>
              </div>
              <svg
                aria-hidden="true"
                className="h-7 w-full text-primary"
                fill="none"
                viewBox="0 0 320 28"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeOpacity="0.25"
                  strokeWidth="2"
                  x1="12"
                  x2="308"
                  y1="14"
                  y2="14"
                />
                <circle cx="16" cy="14" fill="currentColor" r="5" />
                <circle cx="110" cy="14" fill="currentColor" r="5" />
                <circle
                  className="text-tertiary-container"
                  cx="208"
                  cy="14"
                  fill="currentColor"
                  r="6"
                />
                <circle cx="304" cy="14" fill="currentColor" r="5" />
              </svg>
            </div>
          </div>

          <div className="relative h-64 w-full overflow-hidden rounded-xl bg-surface-container-highest shadow-md">
            <R2Image
              src={editorialPhoto ? photoSrc(editorialPhoto, "medium") : null}
              srcSet={editorialPhoto ? photoSrcSet(editorialPhoto) : undefined}
              sizes="(max-width: 1024px) 100vw, 40vw"
              alt={
                editorialPhoto?.alt ||
                "Documentary event photography assignment by TK Media"
              }
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
