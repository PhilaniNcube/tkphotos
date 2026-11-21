import * as React from "react";
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
  const [{ service }, locationPhoto] = await Promise.all([
    searchParams,
    getContactLocationMedia(),
  ]);

  const initialService =
    service && VALID_SERVICE_VALUES.has(service) ? service : "";

  return (
    <div className="flex w-full flex-col bg-surface">
      <ContactHeroSection />
      <section className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <ContactChannelsSection locationPhoto={locationPhoto} />
          <ContactInquiryFormSection initialService={initialService} />
        </div>
      </section>
    </div>
  );
}
