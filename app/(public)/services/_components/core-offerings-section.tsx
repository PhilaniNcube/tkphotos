import * as React from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Film,
  FolderKanban,
  Megaphone,
  Presentation,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

interface Offering {
  title: string;
  startingRate: string;
  blurb: string;
  points: string[];
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const offerings: Offering[] = [
  {
    title: "Event Photography",
    startingRate: "From R5 000",
    blurb:
      "From intimate celebrations to large-scale productions, capturing authentic atmosphere, key rituals, and candid interactions.",
    points: [
      "Weddings, parties, launches, and galas",
      "Discreet, documentary-focused approach",
      "Rapid turnaround highlight set on request",
    ],
    ctaLabel: "Explore event tiers",
    icon: Sparkles,
  },
  {
    title: "Family Photography",
    startingRate: "From R1 000",
    blurb:
      "Natural, relaxed sessions that freeze genuine connection — ideal for growing families, milestones, and annual keepsakes.",
    points: [
      "On-location or studio lifestyle sessions",
      "Gentle direction without stiff posing",
      "Print-ready digital downloads",
    ],
    ctaLabel: "Explore studio shoots",
    icon: Users,
  },
  {
    title: "Sports / Action Photography",
    startingRate: "From R4 500",
    blurb:
      "High-impact imagery tracking speed, athletic intensity, and decisive moments for clubs, federations, and sponsors.",
    points: [
      "Fast telephoto burst capture workflow",
      "Tournaments, matches, and endurance events",
      "Same-day press & sponsor selects",
    ],
    ctaLabel: "Explore sports tiers",
    icon: Trophy,
  },
  {
    title: "Conference Photography",
    startingRate: "From R6 000",
    blurb:
      "Comprehensive coverage of plenaries, breakout sessions, executive portraits, and networking for post-event reporting.",
    points: [
      "Agenda-aware multi-session planning",
      "Same-day selects for social & press",
      "Consistent color and brand alignment",
    ],
    ctaLabel: "Explore corporate tiers",
    icon: Presentation,
  },
  {
    title: "Videography",
    startingRate: "From R4 000",
    blurb:
      "Cinematic short-form films for promos, event recaps, and social reels — pairing clean motion with crisp interview audio.",
    points: [
      "4K acquisition with stabilized motion",
      "Interview and ambient audio capture",
      "Editorial color grading and cutdowns",
    ],
    ctaLabel: "Explore video tiers",
    icon: Film,
  },
  {
    title: "Media Management",
    startingRate: "From R3 000",
    blurb:
      "Organized visual asset workflows including ingest, social calendars, redundant cloud backups, and campaign design.",
    points: [
      "Redundant backup and catalog hygiene",
      "Monthly content calendars and reels",
      "Cloud gallery delivery & archive strategy",
    ],
    ctaLabel: "Explore media tiers",
    icon: FolderKanban,
  },
];

export function CoreOfferingsSection() {
  return (
    <section className="w-full bg-surface-container-low px-6 py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              01 / Core Offerings
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
              Tailored Production Disciplines
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
            Transparent starting rates in South African Rand (ZAR). Every brief
            scales to your schedule, venue, and deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offerings.map((item) => {
            const Icon = item.icon || Camera || Megaphone;
            return (
              <article
                key={item.title}
                className="group flex flex-col justify-between rounded-xl bg-surface-container-lowest p-7 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed transition-colors group-hover:bg-primary group-hover:text-on-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-semibold text-on-tertiary-fixed">
                      {item.startingRate}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-on-surface">
                    {item.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                    {item.blurb}
                  </p>

                  <ul className="mb-6 space-y-2.5">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-on-surface"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#packages"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-container transition-colors"
                >
                  <span>{item.ctaLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
