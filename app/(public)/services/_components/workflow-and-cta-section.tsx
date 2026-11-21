import * as React from "react";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Align on your goals, audience, event schedule, visual references, and required deliverables.",
  },
  {
    number: "02",
    title: "Planning",
    description:
      "Shot lists, location logistics, permissions, and technical lighting prep handled collaboratively.",
  },
  {
    number: "03",
    title: "Capture",
    description:
      "Calm on-site execution with redundant dual-slot media capture and clear communication.",
  },
  {
    number: "04",
    title: "Post-Production",
    description:
      "Meticulous culling, calibrated color grading, retouching, and sound polish where video applies.",
  },
  {
    number: "05",
    title: "Delivery",
    description:
      "Private high-res cloud galleries and social-ready exports delivered cleanly on schedule.",
  },
];

export function WorkflowAndCtaSection() {
  return (
    <section className="w-full bg-on-surface px-6 py-20 text-surface lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-inverse-primary">
              03 / Our Workflow
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-surface sm:text-4xl">
              How It Works
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-surface-dim">
            A streamlined five-stage production pipeline designed to keep every
            booking clear and effortless from consultation to archive.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between rounded-xl bg-inverse-surface p-6"
            >
              <div>
                <span className="mb-4 block font-mono text-3xl font-bold text-inverse-primary">
                  {step.number}
                </span>
                <h3 className="mb-2 text-lg font-bold text-surface">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-surface-dim">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-primary p-8 text-on-primary sm:p-10 md:flex-row">
          <div>
            <h3 className="mb-2 text-2xl font-bold">Ready to book your date?</h3>
            <p className="max-w-xl text-sm leading-relaxed text-on-primary-container">
              Share your event details, campaign brief, or studio session ideas
              and receive a tailored quote within 24 hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <AppButton
              variant="inverse"
              size="lg"
              render={<Link href="/contact" />}
            >
              <span>Start a Project</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </AppButton>
            <AppButton
              variant="inverseOutline"
              size="lg"
              render={<Link href="/galleries" />}
            >
              <Images className="h-4 w-4" aria-hidden="true" />
              <span>View Portfolio</span>
            </AppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
