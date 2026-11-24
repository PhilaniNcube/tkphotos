import * as React from "react";
import type { HeroSlide } from "@/lib/queries/editorial-media";
import { HeroCarouselClient } from "./hero-carousel-client";

const R2_BASE = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  "https://pub-b79d4510b2274749bab0c670fd9bdfa5.r2.dev"
).replace(/\/+$/, "");

function staticHeroPhoto(opts: {
  id: string;
  baseName: string;
  ext: string;
  caption: string;
  createdAt: string;
  galleryId: number;
  galleryTitle: string;
  gallerySlug: string;
  width: number;
  height: number;
  /** Optional upload subfolder under /media, used by newer asset paths. */
  directory?: string;
}) {
  const {
    id,
    baseName,
    ext,
    caption,
    createdAt,
    galleryId,
    galleryTitle,
    gallerySlug,
    width,
    height,
    directory,
  } = opts;
  const assetPath = directory
    ? `media/${directory}/${baseName}`
    : `media/${baseName}`;
  return {
    id,
    filename: `${baseName}.${ext}`,
    storage_key: `${R2_BASE}/${assetPath}-1280x853.webp`,
    url: `${R2_BASE}/${assetPath}.${ext}`,
    caption: null,
    alt: caption,
    created_at: createdAt,
    is_featured: false,
    gallery_id: galleryId,
    gallery_title: galleryTitle,
    gallery_slug: gallerySlug,
    width,
    height,
    metadata: { width, height, type: "jpeg" },
    sizes: {
      thumbnail: {
        url: `${R2_BASE}/${assetPath}-480x320.webp`,
        width: 480,
        height: 320,
        mimeType: "image/webp",
      },
      medium: {
        url: `${R2_BASE}/${assetPath}-1280x853.webp`,
        width: 1280,
        height: 853,
        mimeType: "image/webp",
      },
      full: {
        url: `${R2_BASE}/${assetPath}-2560x1707.webp`,
        width: 2560,
        height: 1707,
        mimeType: "image/webp",
      },
    },
  };
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "weddings",
    discipline: "Weddings",
    galleryTitle: "Traditional Weddings",
    gallerySlug: "traditional-weddings",
    location: "Eastern Cape",
    caption:
      "Xhosa heritage wedding portraits bathed in late-afternoon Eastern Cape light.",
    objectPosition: "object-[65%_35%]",
    photo: staticHeroPhoto({
      id: "407",
      baseName: "457A9885",
      ext: "jpg",
      caption:
        "Xhosa heritage wedding portraits bathed in late-afternoon Eastern Cape light.",
      createdAt: "2025-08-28T18:56:16.884Z",
      galleryId: 17,
      galleryTitle: "Traditional Weddings",
      gallerySlug: "traditional-weddings",
      width: 6000,
      height: 4000,
    }),
  },
  {
    id: "festivals",
    discipline: "Festivals",
    galleryTitle: "Music In The Snow",
    gallerySlug: "music-in-the-snow",
    location: "Hogsback, EC",
    caption:
      "Concert stage lighting and live performance storytelling after dark.",
    objectPosition: "object-[50%_35%]",
    photo: staticHeroPhoto({
      id: "e6ad605b",
      baseName: "3L0A8855",
      ext: "jpg",
      directory: "e6ad605b-fbfd-45d8-9fc9-0edeb0aa5900",
      caption:
        "Concert stage lighting and live performance storytelling after dark.",
      createdAt: "2026-11-24T20:19:49.000Z",
      galleryId: 22,
      galleryTitle: "Music In The Snow",
      gallerySlug: "music-in-the-snow",
      width: 6720,
      height: 4480,
    }),
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
    photo: staticHeroPhoto({
      id: "243",
      baseName: "3L0A8318",
      ext: "jpg",
      caption:
        "Intimate milestone portraiture sculpted with natural window light.",
      createdAt: "2025-08-25T20:17:58.552Z",
      galleryId: 15,
      galleryTitle: "Matric Dance",
      gallerySlug: "matric-dance",
      width: 6720,
      height: 4480,
    }),
  },
  {
    id: "white-wedding",
    discipline: "White Wedding",
    galleryTitle: "White Wedding",
    gallerySlug: "white-wedding",
    location: "Eastern Cape",
    caption:
      "White wedding family portraits captured in soft, even Eastern Cape daylight.",
    objectPosition: "object-[50%_30%]",
    photo: staticHeroPhoto({
      id: "8ebd3296",
      baseName: "file013007",
      ext: "jpg",
      directory: "8ebd3296-567d-4f91-a284-278bf060d135",
      caption:
        "White wedding family portraits captured in soft, even Eastern Cape daylight.",
      createdAt: "2026-11-24T20:13:13.000Z",
      galleryId: 0,
      galleryTitle: "White Wedding",
      gallerySlug: "white-wedding",
      width: 6720,
      height: 4480,
    }),
  },
  {
    id: "landscapes",
    discipline: "Landscapes",
    galleryTitle: "Landscapes",
    gallerySlug: "landscapes",
    location: "Amatola Highlands",
    caption: "Storm fronts and open horizons across the Eastern Cape interior.",
    objectPosition: "object-center",
    photo: staticHeroPhoto({
      id: "285",
      baseName: "3L0A4595",
      ext: "jpg",
      caption:
        "Storm fronts and open horizons across the Eastern Cape interior.",
      createdAt: "2025-08-26T08:12:00.820Z",
      galleryId: 24,
      galleryTitle: "Landscapes",
      gallerySlug: "landscapes",
      width: 6720,
      height: 4480,
    }),
  },
];

export function HeroCarouselSection() {
  return <HeroCarouselClient slides={HERO_SLIDES} />;
}
