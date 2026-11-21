import * as React from "react";
import { Clock, Facebook, Instagram, Mail, MapPin } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet, type PhotoRow } from "@/lib/media";
import { photoSrc } from "@/lib/utils";

interface ContactChannelsSectionProps {
  locationPhoto: PhotoRow | null;
}

const socialChannels = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@thandikayamatokazizizi?_t=ZM-8zGISpU5Osw&_r=1",
    icon: FaTiktok,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/tkphotography_and_videography?igsh=aWp3bjd5NzA0cjF1&utm_source=qr",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1DchY5rHjk/?mibextid=wwXIfr",
    icon: Facebook,
  },
];

export function ContactChannelsSection({
  locationPhoto,
}: ContactChannelsSectionProps) {
  return (
    <div className="space-y-6 lg:col-span-5">
      <div className="rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm sm:p-8">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          01 / Direct Channels
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-on-surface">
          Studio Contact Details
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Available for commissioned assignments, multi-day cultural events, and
          brand storytelling throughout South Africa.
        </p>

        <dl className="mt-6 space-y-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                Direct Email
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-on-surface">
                <a
                  href="mailto:info@tkmedia.co.za"
                  className="hover:text-primary transition-colors"
                >
                  info@tkmedia.co.za
                </a>
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                Service Area
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-on-surface">
                Eastern Cape &amp; Nationwide Travel
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <Clock className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                Response Window
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-on-surface">
                Within 24 hours (Mon &ndash; Sat)
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-7 border-t border-outline-variant/50 pt-6">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
            Social Channels
          </p>
          <div className="flex flex-wrap gap-2.5">
            {socialChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant/70 bg-surface-container-low px-3.5 py-2 text-xs font-semibold text-on-surface hover:border-primary/40 hover:bg-primary-fixed/50 hover:text-primary transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{channel.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-outline-variant/60 bg-surface-container-lowest shadow-sm">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container-high">
          <R2Image
            src={locationPhoto ? photoSrc(locationPhoto, "medium") : null}
            srcSet={locationPhoto ? photoSrcSet(locationPhoto) : undefined}
            sizes="(max-width: 1024px) 100vw, 40vw"
            alt={
              locationPhoto?.caption ||
              "Eastern Cape landscape — TK Media base of operations"
            }
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-surface">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-tertiary-fixed">
              Base of Operations
            </span>
            <p className="text-base font-bold">
              Alice &amp; Bhisho, Eastern Cape
            </p>
          </div>
        </div>
        <div className="px-6 py-4 text-xs leading-relaxed text-on-surface-variant">
          Grounded in natural light documentary storytelling across East London,
          Gqeberha, Makhanda, and destinations nationwide.
        </div>
      </div>
    </div>
  );
}
