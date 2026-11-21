import type { Gallery, Media } from "@/payload-types";

import { toPhotoRow, type PhotoRow } from "../media";
import { getPayloadClient } from "../payload";
import {
  getFeaturedPhotos,
  getPhotoByLegacyUrl,
  getPhotosByLegacyUrls,
} from "./photos";

export const HERO_LEGACY_URLS = [
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvHp3Ev2uPJ1zb6YVQ7X8wASmdhyxevWU2tL4K",
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxv8VDE0SCZ2cukOPCKHZ1tJvA3arexRl7bqd4I",
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvs6r8S60MxNnfSJ1LF2w7eUsGP9R4QBmzIkbg",
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvP1dFiygiyHLlD9c1F6kOV073etrpfmnzqKJd",
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxv4cBfHfsyqYrMLSTDF2ERoyNwCh1d0fQsGBiA",
];

export const ABOUT_PORTRAIT_LEGACY_URL =
  "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvZFXisQnCMRxelq86Yd95OruyTwQtaIKSNHzB";

async function resolveGalleryCoverPhoto(slug: string): Promise<PhotoRow | null> {
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

export async function getHeroCarouselMedia(): Promise<PhotoRow[]> {
  const photos = await getPhotosByLegacyUrls(HERO_LEGACY_URLS);
  if (photos.length > 0) return photos;
  return getFeaturedPhotos(5);
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
  const [wedding, sports, corporate] = await Promise.all([
    resolveGalleryCoverPhoto("white-wedding"),
    resolveGalleryCoverPhoto("varsity-cup-2025"),
    resolveGalleryCoverPhoto("vice-chancellor-s-breakfast"),
  ]);

  const fallbacks =
    !wedding || !sports || !corporate ? await getFeaturedPhotos(3) : [];

  return [
    {
      label: "Weddings & Events",
      slug: "white-wedding",
      photo: wedding ?? fallbacks[0] ?? null,
    },
    {
      label: "Sports & Action",
      slug: "varsity-cup-2025",
      photo: sports ?? fallbacks[1] ?? null,
    },
    {
      label: "Corporate & Media",
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
