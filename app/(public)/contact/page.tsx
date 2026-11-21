import * as React from "react";
import { Suspense } from "react";
import { SERVICE_OPTIONS } from "@/lib/schema";
import { getContactLocationMedia } from "@/lib/queries/editorial-media";
import { ContactChannelsSection } from "./_components/contact-channels-section";
import { ContactHeroSection } from "./_components/contact-hero-section";
import { ContactInquiryFormSection } from "./_components/contact-inquiry-form-section";

interface ContactPageProps {
  searchParams: Promise<{ service?: string }>;
}

const VALID_SERVICE_VALUES = new Set(SERVICE_OPTIONS.map((o) => o.value));

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const locationPhoto = await getContactLocationMedia();

  return (
    <div className="flex w-full flex-col bg-surface">
      <ContactHeroSection />
      <section className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <ContactChannelsSection locationPhoto={locationPhoto} />
          <Suspense fallback={<ContactFormFallback />}>
            <ContactFormWithService searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function ContactFormWithService({ searchParams }: ContactPageProps) {
  const { service } = await searchParams;

  const initialService =
    service && VALID_SERVICE_VALUES.has(service) ? service : "";

  return <ContactInquiryFormSection initialService={initialService} />;
}

function ContactFormFallback() {
  return (
    <div className="space-y-5 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 lg:col-span-7">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-container" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-lg bg-surface-container"
        />
      ))}
      <div className="h-11 w-40 animate-pulse rounded-lg bg-surface-container" />
    </div>
  );
}
