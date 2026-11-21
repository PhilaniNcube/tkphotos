import * as React from "react";
import { CalendarCheck2, History, Images } from "lucide-react";

const stats = [
  {
    eyebrow: "Experience",
    value: "9+",
    label: "Years Experience",
    note: "Active Since 2016",
    highlighted: false,
    icon: History,
  },
  {
    eyebrow: "Assignments",
    value: "400+",
    label: "Sessions Covered",
    note: "Weddings, Portraits & Events",
    highlighted: true,
    icon: CalendarCheck2,
  },
  {
    eyebrow: "Archive",
    value: "50K+",
    label: "Images Delivered",
    note: "Curated & Color-Graded",
    highlighted: false,
    icon: Images,
  },
];

export function StudioStatsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={
                stat.highlighted
                  ? "flex flex-col justify-between space-y-4 rounded-xl bg-primary p-8 text-on-primary shadow-md"
                  : "flex flex-col justify-between space-y-4 rounded-xl bg-surface-container p-8 text-on-surface shadow-sm"
              }
            >
              <div className="flex items-center justify-between">
                <span
                  className={
                    stat.highlighted
                      ? "font-mono text-xs uppercase tracking-widest text-on-primary/80"
                      : "font-mono text-xs uppercase tracking-widest text-on-surface-variant"
                  }
                >
                  {stat.eyebrow}
                </span>
                <Icon
                  className={
                    stat.highlighted
                      ? "h-5 w-5 text-tertiary-fixed"
                      : "h-5 w-5 text-primary"
                  }
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="font-mono text-4xl font-bold tracking-tight lg:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-base font-semibold">{stat.label}</p>
                <p
                  className={
                    stat.highlighted
                      ? "mt-1 font-mono text-xs text-on-primary/80"
                      : "mt-1 font-mono text-xs text-primary"
                  }
                >
                  {stat.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
