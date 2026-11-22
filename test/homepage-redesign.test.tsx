import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";

const {
  mockCacheLife,
  mockCacheTag,
  mockGetHeroCarouselSlides,
  mockGetHomepageExpertiseMedia,
  mockGetHomepageFeaturedWork,
  mockGetBookingCtaBackdropMedia,
  mockGetHomepageGalleries,
} = vi.hoisted(() => ({
  mockCacheLife: vi.fn(),
  mockCacheTag: vi.fn(),
  mockGetHeroCarouselSlides: vi.fn(),
  mockGetHomepageExpertiseMedia: vi.fn(),
  mockGetHomepageFeaturedWork: vi.fn(),
  mockGetBookingCtaBackdropMedia: vi.fn(),
  mockGetHomepageGalleries: vi.fn(),
}));

vi.mock("next/cache", () => ({
  cacheLife: mockCacheLife,
  cacheTag: mockCacheTag,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string | { pathname?: string | null };
  }) => {
    const resolvedHref =
      typeof href === "string" ? href : (href?.pathname ?? "");
    return (
      <a href={resolvedHref} {...props}>
        {children}
      </a>
    );
  },
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    priority: _priority,
    fill: _fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
    fill?: boolean;
  }) => {
    void _priority;
    void _fill;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        {...props}
      />
    );
  },
}));

vi.mock("@/lib/queries/editorial-media", () => ({
  getHeroCarouselSlides: mockGetHeroCarouselSlides,
  getHomepageExpertiseMedia: mockGetHomepageExpertiseMedia,
  getHomepageFeaturedWork: mockGetHomepageFeaturedWork,
  getBookingCtaBackdropMedia: mockGetBookingCtaBackdropMedia,
}));

vi.mock("@/lib/queries/galleries", () => ({
  getHomepageGalleries: mockGetHomepageGalleries,
}));

import type { PhotoRow } from "@/lib/media";
import type {
  HeroSlide,
  HomepageExpertiseItem,
} from "@/lib/queries/editorial-media";
import type { GalleryWithPhotos } from "@/lib/queries/galleries";
import { HeroCarouselClient } from "@/app/(public)/_components/home/hero-carousel-client";
import { HeroCarouselSection } from "@/app/(public)/_components/home/hero-carousel-section";
import { StudioManifestoSection } from "@/app/(public)/_components/home/studio-manifesto-section";
import { ExpertiseShowcaseSection } from "@/app/(public)/_components/home/expertise-showcase-section";
import { FeaturedWorkSection } from "@/app/(public)/_components/home/featured-work-section";
import { FeaturedGalleriesSection } from "@/app/(public)/_components/home/featured-galleries-section";
import { ClientTestimonialsSection } from "@/app/(public)/_components/home/client-testimonials-section";
import { BookingCtaBandSection } from "@/app/(public)/_components/home/booking-cta-band-section";

const agent = createAgent();

const R2_BASE = "https://pub-b79d4510b2274749bab0c670fd9bdfa5.r2.dev";

function makePhoto(
  id: string,
  caption: string,
  galleryTitle: string,
  gallerySlug: string
): PhotoRow {
  const filename = `${id}.webp`;
  const url = `${R2_BASE}/${filename}`;
  return {
    id,
    filename,
    storage_key: url,
    url,
    caption,
    alt: caption,
    created_at: "2026-08-12T10:00:00.000Z",
    is_featured: true,
    gallery_id: Number(id) || 1,
    gallery_title: galleryTitle,
    gallery_slug: gallerySlug,
    width: 1600,
    height: 1067,
    metadata: { width: 1600, height: 1067, type: "webp" },
    sizes: {
      thumbnail: { url, width: 480, height: 320, mimeType: "image/webp" },
      medium: { url, width: 1280, height: 853, mimeType: "image/webp" },
      full: { url, width: 2560, height: 1707, mimeType: "image/webp" },
    },
  };
}

const sampleHeroSlides: HeroSlide[] = [
  {
    id: "weddings",
    discipline: "Weddings",
    galleryTitle: "Traditional Weddings",
    gallerySlug: "traditional-weddings",
    location: "Eastern Cape",
    caption:
      "Xhosa heritage wedding portraits bathed in late-afternoon Eastern Cape light.",
    objectPosition: "object-[65%_35%]",
    photo: makePhoto(
      "407",
      "Traditional wedding portrait",
      "Traditional Weddings",
      "traditional-weddings"
    ),
  },
  {
    id: "live-events",
    discipline: "Live Events",
    galleryTitle: "Music In The Snow",
    gallerySlug: "music-in-the-snow",
    location: "Hogsback, EC",
    caption:
      "Concert stage lighting and live performance storytelling after dark.",
    objectPosition: "object-[55%_25%]",
    photo: makePhoto(
      "271",
      "Live concert spotlight",
      "Music In The Snow",
      "music-in-the-snow"
    ),
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
    photo: makePhoto(
      "243",
      "Editorial portrait",
      "Matric Dance",
      "matric-dance"
    ),
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
    photo: makePhoto(
      "44",
      "PSL matchday tackle",
      "Chippa Vs TS Galaxy",
      "chippa-vs-ts-galaxy"
    ),
  },
  {
    id: "landscapes",
    discipline: "Landscapes",
    galleryTitle: "Landscapes",
    gallerySlug: "landscapes",
    location: "Amatola Highlands",
    caption:
      "Storm fronts and open horizons across the Eastern Cape interior.",
    objectPosition: "object-center",
    photo: makePhoto(
      "285",
      "Eastern Cape highway storm clouds",
      "Landscapes",
      "landscapes"
    ),
  },
];

const sampleExpertiseItems: HomepageExpertiseItem[] = [
  {
    id: "anniversary_wedding",
    index: "01",
    title: "Weddings & Celebrations",
    startingRate: "From R6 000",
    summary:
      "Traditional and white weddings documented with natural light and quiet editorial poise.",
    highlights: [
      "Full-day documentary coverage",
      "Same-week curated preview set",
      "Print-ready R2 gallery archive",
    ],
    gallerySlug: "white-wedding",
    galleryTitle: "White Wedding",
    serviceParam: "anniversary_wedding",
    photo: makePhoto(
      "415",
      "Wedding couple portrait",
      "White Wedding",
      "white-wedding"
    ),
  },
  {
    id: "sport",
    index: "02",
    title: "Sports & Action",
    startingRate: "From R4 500",
    summary:
      "Fast telephoto coverage capturing decisive tackles, tries, and stadium atmosphere.",
    highlights: [
      "Floodlit night-match capability",
      "Rapid press & sponsor selects",
      "PSL & Varsity Cup experience",
    ],
    gallerySlug: "varsity-shield",
    galleryTitle: "Varsity Shield",
    serviceParam: "sport",
    photo: makePhoto(
      "155",
      "Varsity Shield rugby scrum",
      "Varsity Shield",
      "varsity-shield"
    ),
  },
  {
    id: "corporate_event",
    index: "03",
    title: "Corporate & Conferences",
    startingRate: "From R6 000",
    summary:
      "Discreet institutional photography for summits, legislatures, and executive portraits.",
    highlights: [
      "Agenda-aware plenary coverage",
      "Same-day media & PR handoff",
      "Consistent brand color grading",
    ],
    gallerySlug: "government-events",
    galleryTitle: "Government Events",
    serviceParam: "corporate_event",
    photo: makePhoto(
      "344",
      "Legislature plenary chamber",
      "Government Events",
      "government-events"
    ),
  },
  {
    id: "entertainment_event",
    index: "04",
    title: "Live Events & 4K Video",
    startingRate: "From R5 000",
    summary:
      "High-energy concerts, festivals, and stabilized 4K recap films.",
    highlights: [
      "Low-light concert specialists",
      "4K highlight reels & cutdowns",
      "Artist & crowd atmosphere frames",
    ],
    gallerySlug: "music-in-the-snow",
    galleryTitle: "Music In The Snow",
    serviceParam: "entertainment_event",
    photo: makePhoto(
      "256",
      "Live saxophone performance",
      "Music In The Snow",
      "music-in-the-snow"
    ),
  },
  {
    id: "social_media_mgmt",
    index: "05",
    title: "Lifestyle & Media Management",
    startingRate: "From R3 000",
    summary:
      "End-to-end visual content calendars and campaign storytelling.",
    highlights: [
      "Campaign & launch storytelling",
      "Monthly social visual calendars",
      "Organized cloud delivery & backups",
    ],
    gallerySlug: "berlin-november",
    galleryTitle: "Berlin November",
    serviceParam: "social_media_mgmt",
    photo: makePhoto(
      "40",
      "Berlin November horse racing",
      "Berlin November",
      "berlin-november"
    ),
  },
];

const sampleGalleries: GalleryWithPhotos[] = [
  {
    id: 2,
    title: "Berlin November",
    slug: "berlin-november",
    description: "Horse racing & lifestyle",
    event_date: "2025-08-04",
    created_at: "2025-08-20T17:10:18.000Z",
    is_public: true,
    cover_image: `${R2_BASE}/40.webp`,
    cover_sizes: null,
    cover_width: 1280,
    cover_height: 853,
    photo_count: 21,
    photos: [
      makePhoto(
        "40",
        "Horse race sprint",
        "Berlin November",
        "berlin-november"
      ),
    ],
  },
  {
    id: 17,
    title: "Traditional Weddings",
    slug: "traditional-weddings",
    description: "Xhosa celebration portraits",
    event_date: "2020-08-20",
    created_at: "2025-08-21T00:00:00.000Z",
    is_public: true,
    cover_image: `${R2_BASE}/407.webp`,
    cover_sizes: null,
    cover_width: 1280,
    cover_height: 853,
    photo_count: 27,
    photos: [
      makePhoto(
        "407",
        "Traditional couple",
        "Traditional Weddings",
        "traditional-weddings"
      ),
    ],
  },
  {
    id: 22,
    title: "Music In The Snow",
    slug: "music-in-the-snow",
    description: "Hogsback winter festival",
    event_date: "2024-07-27",
    created_at: "2025-08-22T00:00:00.000Z",
    is_public: true,
    cover_image: `${R2_BASE}/256.webp`,
    cover_sizes: null,
    cover_width: 1280,
    cover_height: 853,
    photo_count: 33,
    photos: [
      makePhoto(
        "256",
        "Saxophonist on stage",
        "Music In The Snow",
        "music-in-the-snow"
      ),
    ],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockGetHeroCarouselSlides.mockResolvedValue(sampleHeroSlides);
  mockGetHomepageExpertiseMedia.mockResolvedValue(sampleExpertiseItems);
  mockGetHomepageFeaturedWork.mockResolvedValue([
    sampleHeroSlides[0].photo,
    sampleHeroSlides[1].photo,
    sampleHeroSlides[2].photo,
  ]);
  mockGetBookingCtaBackdropMedia.mockResolvedValue(sampleHeroSlides[4].photo);
  mockGetHomepageGalleries.mockResolvedValue(sampleGalleries);
});

describe("HeroCarouselSection", () => {
  it("renders hardcoded slides without DB fetching, updates the spotlight card on pill selection, and names all agent controls", async () => {
    const user = userEvent.setup();

    const origClientWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth"
    );
    const origOffsetWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetWidth"
    );
    const origOffsetLeft = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetLeft"
    );
    const origScrollWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollWidth"
    );
    const origGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    const origScrollTo = Element.prototype.scrollTo;

    const slotWidth = 1200;
    const slideIndex = (el: Element): number => {
      const parent = el.parentElement;
      return parent ? Array.from(parent.children).indexOf(el) : 0;
    };

    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get() {
        const slot = (this as HTMLElement).getAttribute("data-slot");
        if (slot === "carousel-viewport" || slot === "carousel-item") {
          return slotWidth;
        }
        return origClientWidth?.get ? origClientWidth.get.call(this) : 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const slot = (this as HTMLElement).getAttribute("data-slot");
        if (slot === "carousel-viewport" || slot === "carousel-item") {
          return slotWidth;
        }
        return origOffsetWidth?.get ? origOffsetWidth.get.call(this) : 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
      configurable: true,
      get() {
        const slot = (this as HTMLElement).getAttribute("data-slot");
        if (slot === "carousel-item") {
          return slideIndex(this as Element) * slotWidth;
        }
        return origOffsetLeft?.get ? origOffsetLeft.get.call(this) : 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get() {
        const slot = (this as HTMLElement).getAttribute("data-slot");
        if (slot === "carousel-viewport" || slot === "carousel-content") {
          return slotWidth * sampleHeroSlides.length;
        }
        return origScrollWidth?.get ? origScrollWidth.get.call(this) : 0;
      },
    });
    HTMLElement.prototype.getBoundingClientRect = function () {
      const slot = this.getAttribute("data-slot");
      if (slot === "carousel-viewport") {
        return new DOMRect(0, 0, slotWidth, 640);
      }
      if (slot === "carousel-item") {
        const left = slideIndex(this) * slotWidth;
        return new DOMRect(left, 0, slotWidth, 640);
      }
      return origGetBoundingClientRect.call(this);
    };
    Element.prototype.scrollTo = function (
      options?: ScrollToOptions | number
    ) {
      if (typeof options === "object" && options && "left" in options) {
        (this as HTMLElement).scrollLeft = options.left ?? 0;
      } else if (typeof options === "number") {
        (this as HTMLElement).scrollLeft = options;
      }
    };

    try {
      render(<HeroCarouselSection />);
      expect(mockGetHeroCarouselSlides).not.toHaveBeenCalled();

      const heroImgs = screen.getAllByRole("img");
      const hasHardcodedHeroFull = heroImgs.some((img) =>
        img.getAttribute("src")?.includes("Keith_PHOTOS_7-2560x1707.webp")
      );
      const hasHardcodedSpotlightThumb = heroImgs.some((img) =>
        img.getAttribute("src")?.includes("Keith_PHOTOS_7-480x320.webp")
      );
      expect(hasHardcodedHeroFull).toBe(true);
      expect(hasHardcodedSpotlightThumb).toBe(true);

      await waitFor(() => {
        for (const pill of [
          "Weddings",
          "Live Events",
          "Editorial",
          "Sports",
          "Landscapes",
        ]) {
          expect(screen.getByRole("tab", { name: pill })).toBeTruthy();
        }
      });

      expect(screen.getAllByText("01 / 05").length).toBeGreaterThanOrEqual(1);
      const initialSpotlight = screen.getByRole("link", {
        name: /Traditional Weddings/i,
      });
      expect(initialSpotlight.getAttribute("href")).toBe(
        "/galleries/traditional-weddings"
      );

      await user.click(screen.getByRole("tab", { name: "Sports" }));

      await waitFor(() => {
        expect(screen.getAllByText("04 / 05").length).toBeGreaterThanOrEqual(1);
        const updatedSpotlight = screen.getByRole("link", {
          name: /Chippa Vs TS Galaxy/i,
        });
        expect(updatedSpotlight.getAttribute("href")).toBe(
          "/galleries/chippa-vs-ts-galaxy"
        );
      });

      expect(
        screen.getByRole("button", { name: "Previous slide" })
      ).toBeTruthy();
      const nextBtn = screen.getByRole("button", { name: "Next slide" });
      await user.click(nextBtn);

      await waitFor(() => {
        expect(screen.getAllByText("05 / 05").length).toBeGreaterThanOrEqual(1);
        expect(
          screen
            .getByRole("link", { name: /Storm fronts/i })
            .getAttribute("href")
        ).toBe("/galleries/landscapes");
      });

      const playToggle = screen.getByRole("button", { name: /slideshow/i });
      expect(playToggle).toBeTruthy();

      const live = agent
        .snapshot()
        .filter((c) => !c.offPage && c.component !== "more");
      for (const entry of live) {
        expect(
          entry.label,
          `${entry.component} ${entry.ref} has no label`
        ).toBeTruthy();
      }
      const labels = live.map((c) => c.label);
      expect(labels).toContain("TK Media featured photography showcase");
      expect(labels).toContain("Book a Session");
      expect(labels).toContain("Explore Galleries");

      const heroAct = await agent.act({
        steps: [
          {
            ref: "TK Media featured photography showcase",
            action: "setPage",
            args: [2],
          },
        ],
      });
      expect(heroAct.ok, heroAct.error?.message).toBe(true);

      await waitFor(() => {
        expect(screen.getAllByText("02 / 05").length).toBeGreaterThanOrEqual(1);
        expect(
          screen
            .getByRole("link", { name: /Music In The Snow/i })
            .getAttribute("href")
        ).toBe("/galleries/music-in-the-snow");
      });
    } finally {
      if (origClientWidth) {
        Object.defineProperty(HTMLElement.prototype, "clientWidth", origClientWidth);
      }
      if (origOffsetWidth) {
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", origOffsetWidth);
      }
      if (origOffsetLeft) {
        Object.defineProperty(HTMLElement.prototype, "offsetLeft", origOffsetLeft);
      }
      if (origScrollWidth) {
        Object.defineProperty(HTMLElement.prototype, "scrollWidth", origScrollWidth);
      }
      HTMLElement.prototype.getBoundingClientRect = origGetBoundingClientRect;
      Element.prototype.scrollTo = origScrollTo;
    }
  });

  it("renders a safe fallback slide when slides is empty or omitted", () => {
    render(<HeroCarouselClient slides={[]} />);

    expect(
      screen.getByRole("heading", { name: /Capturing moments that/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Book a Session" }).getAttribute("href")
    ).toBe("/contact");
    expect(
      screen
        .getByRole("link", { name: "Explore Galleries" })
        .getAttribute("href")
    ).toBe("/galleries");
  });
});

describe("ExpertiseShowcaseSection", () => {
  it("fetches and caches expertise media and switches disciplines via click, ArrowDown, and agent actions", async () => {
    const user = userEvent.setup();
    const expertiseEl = await ExpertiseShowcaseSection();

    expect(mockCacheLife).toHaveBeenCalledWith("days");
    expect(mockCacheTag).toHaveBeenCalledWith("homepage", "homepage-expertise");
    expect(mockGetHomepageExpertiseMedia).toHaveBeenCalledTimes(1);

    render(expertiseEl);

    const initialInquire = screen.getByRole("link", { name: "Inquire" });
    expect(initialInquire.getAttribute("href")).toBe(
      "/contact?service=anniversary_wedding"
    );
    expect(
      screen.getByRole("img", { name: "Wedding couple portrait" })
    ).toBeTruthy();

    const sportsTab = screen.getByRole("tab", { name: /Sports & Action/i });
    await user.click(sportsTab);

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "Inquire" }).getAttribute("href")
      ).toBe("/contact?service=sport");
      expect(
        screen.getByRole("img", { name: "Varsity Shield rugby scrum" })
      ).toBeTruthy();
    });

    sportsTab.focus();
    await user.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "Inquire" }).getAttribute("href")
      ).toBe("/contact?service=corporate_event");
      expect(
        screen.getByRole("img", { name: "Legislature plenary chamber" })
      ).toBeTruthy();
    });

    const live = agent
      .snapshot()
      .filter((c) => !c.offPage && c.component !== "more");
    for (const entry of live) {
      expect(
        entry.label,
        `${entry.component} ${entry.ref} has no label`
      ).toBeTruthy();
    }
    const labels = live.map((c) => c.label);
    expect(labels).toContain("Photography and media disciplines");
    expect(labels).toContain("Inquire");

    const actResult = await agent.act({
      steps: [
        {
          ref: "Photography and media disciplines",
          action: "setValue",
          args: ["entertainment_event"],
        },
      ],
    });
    expect(actResult.ok, actResult.error?.message).toBe(true);

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "Inquire" }).getAttribute("href")
      ).toBe("/contact?service=entertainment_event");
    });
  });
});

describe("Self-fetching homepage sections (FeaturedWork, FeaturedGalleries, BookingCtaBand, Manifesto, Testimonials)", () => {
  it("each section fetches and caches its own data and renders accessible markup", async () => {
    const [featuredWorkEl, featuredGalleriesEl, bookingCtaEl] =
      await Promise.all([
        FeaturedWorkSection(),
        FeaturedGalleriesSection(),
        BookingCtaBandSection(),
      ]);

    expect(mockCacheLife).toHaveBeenCalledWith("days");
    expect(mockCacheTag).toHaveBeenCalledWith(
      "homepage",
      "homepage-featured-work"
    );
    expect(mockCacheTag).toHaveBeenCalledWith(
      "homepage",
      "homepage-featured-galleries"
    );
    expect(mockCacheTag).toHaveBeenCalledWith(
      "homepage",
      "homepage-booking-cta"
    );
    expect(mockGetHomepageFeaturedWork).toHaveBeenCalledTimes(1);
    expect(mockGetHomepageGalleries).toHaveBeenCalledWith({
      gallerySlugs: [
        "berlin-november",
        "traditional-weddings",
        "music-in-the-snow",
      ],
      photosPerGallery: 1,
      includeMeta: true,
      fallbackToRecent: true,
    });
    expect(mockGetBookingCtaBackdropMedia).toHaveBeenCalledTimes(1);

    render(
      <>
        <StudioManifestoSection />
        {featuredWorkEl}
        {featuredGalleriesEl}
        <ClientTestimonialsSection />
        {bookingCtaEl}
      </>
    );

    expect(screen.getByText("9+")).toBeTruthy();
    expect(screen.getByText("400+")).toBeTruthy();
    expect(screen.getByText("50K+")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "More About TK" }).getAttribute("href")
    ).toBe("/about");

    expect(screen.getByText("Featured Work")).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Explore full archive" })
        .getAttribute("href")
    ).toBe("/galleries");

    expect(screen.getByText("21 frames")).toBeTruthy();
    expect(screen.getByText("27 frames")).toBeTruthy();
    expect(screen.getByText("33 frames")).toBeTruthy();
    expect(screen.getByText("2025")).toBeTruthy();
    expect(screen.getByText("2020")).toBeTruthy();
    expect(screen.getByText("2024")).toBeTruthy();

    expect(screen.getByText("Trusted Across the Eastern Cape")).toBeTruthy();

    expect(
      screen
        .getByRole("link", { name: "Start a Conversation" })
        .getAttribute("href")
    ).toBe("/contact");
    expect(
      screen
        .getByRole("link", { name: "View Services & Rates" })
        .getAttribute("href")
    ).toBe("/services");

    const live = agent
      .snapshot()
      .filter((c) => !c.offPage && c.component !== "more");
    for (const entry of live) {
      expect(
        entry.label,
        `${entry.component} ${entry.ref} has no label`
      ).toBeTruthy();
    }
  });
});
