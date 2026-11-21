import * as React from "react";
import Link from "next/link";
import { AppButton } from "@/components/ui-sdk/button";

export function PrivateClientAccessSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 lg:px-12">
      <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-surface-container-high p-8 sm:p-10 md:flex-row md:items-center">
        <div className="max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Private Client Access
          </p>
          <h2 className="mb-2 text-2xl font-bold text-on-surface">
            Looking for a specific event gallery?
          </h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Full-resolution client galleries and private event archives are
            accessible via your TK Media client portal or direct booking link.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <AppButton
            variant="primary"
            size="md"
            render={<Link href="/protected" />}
          >
            Client Portal
          </AppButton>
          <AppButton
            variant="outline"
            size="md"
            render={<Link href="/contact" />}
          >
            Book a Session
          </AppButton>
        </div>
      </div>
    </section>
  );
}
