import * as React from "react";
import { staticPhotoRow } from "@/lib/media";
import type { HeroSlide } from "@/lib/queries/editorial-media";
import { HeroCarouselClient } from "./hero-carousel-client";

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
    photo: staticPhotoRow({
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
    photo: staticPhotoRow({
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
    photo: staticPhotoRow({
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
    photo: staticPhotoRow({
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
    photo: staticPhotoRow({
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
