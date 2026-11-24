import { cacheLife, cacheTag } from "next/cache";
import type { Gallery, Media } from "@/payload-types";

import { staticPhotoRow, toPhotoRow, type PhotoRow } from "../media";
import { getPayloadClient } from "../payload";
import {
  getFeaturedPhotos,
  getPhotoByLegacyUrl,
  getPhotosByLegacyUrls,
} from "./photos";

export interface HeroSlide {
  id: string;
  discipline: string;
  galleryTitle: string;
  gallerySlug: string | null;
  location: string;
  caption: string;
  objectPosition: string;
  photo: PhotoRow;
}

interface HeroSlideSpec extends Omit<HeroSlide, "photo"> {
  legacyUrl: string;
}

const HERO_SLIDE_SPECS: HeroSlideSpec[] = [
  {
    id: "weddings",
    discipline: "Weddings",
    galleryTitle: "Traditional Weddings",
    gallerySlug: "traditional-weddings",
    location: "Eastern Cape",
    caption:
      "Xhosa heritage wedding portraits bathed in late-afternoon Eastern Cape light.",
    objectPosition: "object-[65%_35%]",
    legacyUrl:
      "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvNpRVNID9kySlI8Mc6uwmOAK4qjNQnXegCFYV",
  },
  {
    id: "festivals",
    discipline: "Festivals",
    galleryTitle: "Music In The Snow",
    gallerySlug: "music-in-the-snow",
    location: "Hogsback, EC",
    caption:
      "Concert stage lighting and live performance storytelling after dark.",
    objectPosition: "object-[55%_25%]",
    legacyUrl:
      "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvpLd4J3qWrLEGxcOQ7fNi6jbasCFB1HtInh4T",
  },
  {
    id: "editorial",
    discipline: "Editorial",
    galleryTitle: "Matric Dance",
    gallerySlug: "matric-dance",
    location: "East London",
    caption:
      "Intimate milestone portraiture sculpted with natural window light.",
    objectPosition: "object-[55%_30%]",
    legacyUrl:
      "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvuPT2Y1UiPC5ogaSe1VyADXbQRBMKr8wfJNqG",
  },
  {
    id: "sports",
    discipline: "Sports",
    galleryTitle: "Chippa Vs TS Galaxy",
    gallerySlug: "chippa-vs-ts-galaxy",
    location: "Buffalo City Stadium",
    caption:
      "Floodlit PSL matchday intensity captured with split-second precision.",
    objectPosition: "object-[60%_30%]",
    legacyUrl:
      "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvqL0Ord8udkRx10Mw8BZtsQTehfXa25DPmzLY",
  },
  {
    id: "landscapes",
    discipline: "Landscapes",
    galleryTitle: "Landscapes",
    gallerySlug: "landscapes",
    location: "Amatola Highlands",
    caption: "Storm fronts and open horizons across the Eastern Cape interior.",
    objectPosition: "object-center",
    legacyUrl:
      "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvzRmn2ZJxvl8TKprfyUAiREB67OCqk9gY03SZ",
  },
];

export const HERO_LEGACY_URLS = HERO_SLIDE_SPECS.map((s) => s.legacyUrl);

export const ABOUT_PORTRAIT_LEGACY_URL =
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvZFXisQnCMRxelq86Yd95OruyTwQtaIKSNHzB";

export interface HomepageExpertiseItem {
  id: string;
  index: string;
  title: string;
  startingRate: string;
  summary: string;
  highlights: string[];
  gallerySlug: string;
  galleryTitle: string;
  serviceParam: string;
  photo: PhotoRow | null;
}

interface ExpertiseSpec extends Omit<HomepageExpertiseItem, "photo"> {
  legacyUrl: string;
  photoOverride?: PhotoRow;
}

const WEDDING_EXPERTISE_PHOTO = staticPhotoRow({
  id: "e7154c80",
  baseName: "3L0A0426",
  ext: "jpg",
  directory: "e7154c80-6e97-417a-b5ce-9a4116b593b1",
  caption: "A newlywed couple walking down the aisle through falling confetti.",
  createdAt: "2026-11-24T22:17:24.000Z",
  galleryId: 0,
  galleryTitle: "White Wedding",
  gallerySlug: "white-wedding",
  width: 6720,
  height: 4480,
});

const CONFERENCE_EXPERTISE_PHOTO = staticPhotoRow({
  id: "a8060867",
  baseName: "3L0A0018",
  ext: "jpg",
  directory: "a8060867-4e2e-4090-a966-d445a75030d2",
  caption:
    "Graduates and dignitaries seated on stage at a formal institutional ceremony.",
  createdAt: "2026-11-24T20:25:19.000Z",
  galleryId: 0,
  galleryTitle: "Government Events",
  gallerySlug: "government-events",
  width: 6720,
  height: 4480,
});

const FESTIVAL_EXPERTISE_PHOTO = staticPhotoRow({
  id: "3b75f418",
  baseName: "file011004",
  ext: "jpg",
  directory: "3b75f418-cfee-4e9f-a84a-c6f0047292ed",
  caption:
    "A live performer on stage in front of a cheering, phone-lit crowd.",
  createdAt: "2026-11-24T20:21:08.000Z",
  galleryId: 0,
  galleryTitle: "Music In The Snow",
  gallerySlug: "music-in-the-snow",
  width: 6720,
  height: 4480,
});

const EXPERTISE_SPECS: ExpertiseSpec[] = [
  {
    id: "anniversary_wedding",
    index: "01",
    title: "Weddings & Celebrations",
    startingRate: "From R6 000",
    summary:
      "Traditional and white weddings, matric dances, and milestone celebrations documented with natural light and quiet editorial poise.",
    highlights: [
      "Full-day documentary coverage",
      "Same-week curated preview set",
      "Print-ready R2 gallery archive",
    ],
    gallerySlug: "white-wedding",
    galleryTitle: "White Wedding",
    serviceParam: "anniversary_wedding",
    legacyUrl:
      "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxviF00soahAgsRtiElY2JK905OBNcQrwSdeFaM",
    photoOverride: WEDDING_EXPERTISE_PHOTO,
  },
  {
    id: "corporate_event",
    index: "02",
    title: "Corporate & Conferences",
    startingRate: "From R6 000",
    summary:
      "Discreet institutional photography for summits, legislatures, executive portraits, and multi-day conferences.",
    highlights: [
      "Agenda-aware plenary coverage",
      "Same-day media & PR handoff",
      "Consistent brand color grading",
    ],
    gallerySlug: "government-events",
    galleryTitle: "Government Events",
    serviceParam: "corporate_event",
    legacyUrl:
      "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvzZiDEcJxvl8TKprfyUAiREB67OCqk9gY03SZ",
    photoOverride: CONFERENCE_EXPERTISE_PHOTO,
  },
  {
    id: "entertainment_event",
    index: "03",
    title: "Festivals & Concerts",
    startingRate: "From R5 000",
    summary:
      "High-energy concerts, festivals, and live stage photography capturing dramatic lighting and crowd atmosphere.",
    highlights: [
      "Low-light concert specialists",
      "Rapid artist & press selects",
      "Artist & crowd atmosphere frames",
    ],
    gallerySlug: "music-in-the-snow",
    galleryTitle: "Music In The Snow",
    serviceParam: "entertainment_event",
    legacyUrl:
      "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvJUvMb3KgUCBP3wZpVqzTsXFR1SijHfIvbr2c",
    photoOverride: FESTIVAL_EXPERTISE_PHOTO,
  },
  {
    id: "social_media_mgmt",
    index: "04",
    title: "Lifestyle & Media Management",
    startingRate: "From R3 000",
    summary:
      "End-to-end visual content calendars, lifestyle campaigns, and structured cloud asset management for Eastern Cape brands.",
    highlights: [
      "Campaign & launch storytelling",
      "Monthly social visual calendars",
      "Organized cloud delivery & backups",
    ],
    gallerySlug: "berlin-november",
    galleryTitle: "Berlin November",
    serviceParam: "social_media_mgmt",
    legacyUrl:
      "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvVjg5s1UB5aKHvFh8QRiUJpsMXyxS1EjutTge",
  },
];

const FEATURED_WORK_LEGACY_URLS = [
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxv9kYSMYLKlILEoS89m5tVRM4c2TZWP3BqudFw",
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxv5K3Bfhvy4qCoK7IkM0Ue2P9NQZbF5XfxE1Oz",
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvOd2NICsrxwMVl2WT4gPhiXvIrkGeBZH6nCK1",
];

const BOOKING_CTA_BACKDROP_LEGACY_URL = HERO_SLIDE_SPECS[4].legacyUrl;

async function resolveGalleryCoverPhoto(slug: string): Promise<PhotoRow | null> {
  "use cache";
  cacheLife("minutes");

  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "galleries",
      where: {
        and: [{ slug: { equals: slug } }, { isPublic: { equals: true } }],
      },
      limit: 1,
      depth: 1,
      joins: false,
      overrideAccess: true,
    });
    const doc = res.docs[0] as Gallery | undefined;
    if (!doc) return null;
    if (doc.coverImage && typeof doc.coverImage === "object") {
      return toPhotoRow(doc.coverImage as Media);
    }
    const media = await payload.find({
      collection: "media",
      where: { gallery: { equals: doc.id } },
      sort: "-createdAt",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const first = media.docs[0] as Media | undefined;
    return first ? toPhotoRow(first) : null;
  } catch {
    return null;
  }
}

export async function getHeroCarouselSlides(): Promise<HeroSlide[]> {
  "use cache";
  cacheLife("days");
  cacheTag("homepage", "homepage-hero");

  const photos = await getPhotosByLegacyUrls(HERO_LEGACY_URLS);
  if (photos.length > 0) {
    const bySlug = new Map(
      photos
        .filter((p): p is PhotoRow & { gallery_slug: string } =>
          Boolean(p.gallery_slug)
        )
        .map((p) => [p.gallery_slug, p])
    );

    const matched: HeroSlide[] = [];
    for (let i = 0; i < HERO_SLIDE_SPECS.length; i++) {
      const spec = HERO_SLIDE_SPECS[i];
      const photo =
        (spec.gallerySlug ? bySlug.get(spec.gallerySlug) : undefined) ??
        photos[i];
      if (!photo) continue;
      matched.push({
        id: spec.id,
        discipline: spec.discipline,
        galleryTitle: photo.gallery_title || spec.galleryTitle,
        gallerySlug: photo.gallery_slug || spec.gallerySlug,
        location: spec.location,
        caption: spec.caption,
        objectPosition: spec.objectPosition,
        photo,
      });
    }
    if (matched.length > 0) return matched;
  }

  const fallback = await getFeaturedPhotos(5);
  return fallback.map((photo, index) => {
    const spec = HERO_SLIDE_SPECS[index % HERO_SLIDE_SPECS.length];
    return {
      id: `${spec.id}-${photo.id}`,
      discipline: photo.gallery_title || spec.discipline,
      galleryTitle: photo.gallery_title || spec.galleryTitle,
      gallerySlug: photo.gallery_slug || spec.gallerySlug,
      location: spec.location,
      caption: photo.caption || spec.caption,
      objectPosition: spec.objectPosition,
      photo,
    };
  });
}

export async function getHeroCarouselMedia(): Promise<PhotoRow[]> {
  const slides = await getHeroCarouselSlides();
  return slides.map((slide) => slide.photo);
}

export async function getHomepageExpertiseMedia(): Promise<
  HomepageExpertiseItem[]
> {
  "use cache";
  cacheLife("days");
  cacheTag("homepage", "homepage-expertise");

  const urls = EXPERTISE_SPECS.map((spec) => spec.legacyUrl);
  const photos = await getPhotosByLegacyUrls(urls);
  const bySlug = new Map(
    photos
      .filter((p): p is PhotoRow & { gallery_slug: string } =>
        Boolean(p.gallery_slug)
      )
      .map((p) => [p.gallery_slug, p])
  );

  return EXPERTISE_SPECS.map((spec, index) => {
    const photo =
      spec.photoOverride ??
      bySlug.get(spec.gallerySlug) ??
      photos[index] ??
      null;
    return {
      id: spec.id,
      index: spec.index,
      title: spec.title,
      startingRate: spec.startingRate,
      summary: spec.summary,
      highlights: spec.highlights,
      gallerySlug: photo?.gallery_slug || spec.gallerySlug,
      galleryTitle: photo?.gallery_title || spec.galleryTitle,
      serviceParam: spec.serviceParam,
      photo,
    };
  });
}

export async function getHomepageFeaturedWork(): Promise<PhotoRow[]> {
  "use cache";
  cacheLife("days");
  cacheTag("homepage", "homepage-featured-work");

  const curated = await getPhotosByLegacyUrls(FEATURED_WORK_LEGACY_URLS);
  if (curated.length >= 3) return curated.slice(0, 3);

  const fallback = await getFeaturedPhotos(3);
  const seen = new Set(curated.map((p) => p.id));
  for (const photo of fallback) {
    if (!seen.has(photo.id)) {
      curated.push(photo);
      seen.add(photo.id);
    }
    if (curated.length >= 3) break;
  }
  return curated;
}

export async function getBookingCtaBackdropMedia(): Promise<PhotoRow | null> {
  "use cache";
  cacheLife("days");
  cacheTag("homepage", "homepage-booking-cta");

  const primary = await getPhotoByLegacyUrl(BOOKING_CTA_BACKDROP_LEGACY_URL);
  if (primary) return primary;

  const slides = await getHeroCarouselSlides();
  return slides[4]?.photo ?? slides[0]?.photo ?? null;
}

export async function getAboutMedia(): Promise<{
  portrait: PhotoRow | null;
  editorial: PhotoRow | null;
}> {
  const [portrait, editorialPrimary, fallback] = await Promise.all([
    getPhotoByLegacyUrl(ABOUT_PORTRAIT_LEGACY_URL),
    resolveGalleryCoverPhoto("vice-chancellor-s-breakfast"),
    resolveGalleryCoverPhoto("youth-quake-national-conference"),
  ]);

  return {
    portrait: portrait ?? fallback,
    editorial: editorialPrimary ?? fallback ?? portrait,
  };
}

export interface ServicesHeroCard {
  label: string;
  slug: string;
  photo: PhotoRow | null;
}

export async function getServicesHeroMedia(): Promise<ServicesHeroCard[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services", "services-hero");

  const [wedding, festivals, corporate] = await Promise.all([
    resolveGalleryCoverPhoto("white-wedding"),
    resolveGalleryCoverPhoto("festivals"),
    resolveGalleryCoverPhoto("graduation"),
  ]);

  const fallbacks =
    !wedding || !festivals || !corporate ? await getFeaturedPhotos(3) : [];

  return [
    {
      label: "Weddings & Events",
      slug: "white-wedding",
      photo: wedding ?? fallbacks[0] ?? null,
    },
    {
      label: "Festivals",
      slug: "music-in-the-snow",
      photo: festivals ?? fallbacks[1] ?? null,
    },
    {
      label: "Conferences & Corporate Media",
      slug: "vice-chancellor-s-breakfast",
      photo: corporate ?? fallbacks[2] ?? null,
    },
  ];
}

export async function getContactLocationMedia(): Promise<PhotoRow | null> {
  const landscape = await resolveGalleryCoverPhoto("landscapes");
  if (landscape) return landscape;
  const hero = await getHeroCarouselMedia();
  return hero[0] ?? null;
}
