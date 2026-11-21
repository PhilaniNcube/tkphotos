import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";

const {
  submitContactMock,
  trackContactFormMock,
  trackServiceInquiryMock,
  trackGalleryViewMock,
  trackImageDownloadMock,
  signOutMock,
  refreshMock,
} = vi.hoisted(() => ({
  submitContactMock: vi.fn(),
  trackContactFormMock: vi.fn(),
  trackServiceInquiryMock: vi.fn(),
  trackGalleryViewMock: vi.fn(),
  trackImageDownloadMock: vi.fn(),
  signOutMock: vi.fn().mockResolvedValue({}),
  refreshMock: vi.fn(),
}));

let mockPathname = "/";

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

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: refreshMock,
  }),
}));

vi.mock("@/lib/client", () => ({
  createClient: () => ({
    auth: {
      signOut: signOutMock,
    },
  }),
}));

vi.mock("@/lib/actions/contact", () => ({
  submitContact: submitContactMock,
}));

vi.mock("@/lib/analytics", () => ({
  trackContactForm: trackContactFormMock,
  trackServiceInquiry: trackServiceInquiryMock,
  trackGalleryView: trackGalleryViewMock,
  trackImageDownload: trackImageDownloadMock,
}));

import { AppToaster } from "@/components/ui-sdk/app-toaster";
import type { CollectionRow, GalleryRow, PhotoRow } from "@/lib/media";
import type { CollectionShowcaseRow } from "@/lib/queries/collections";
import type { GalleryWithPhotos } from "@/lib/queries/galleries";
import { SiteHeaderShell } from "@/app/(public)/_components/site-header-shell";
import { DesktopNavMenu } from "@/app/(public)/_components/desktop-nav-menu";
import { MobileNavDrawer } from "@/app/(public)/_components/mobile-nav-drawer";
import { PackagesPricingSection } from "@/app/(public)/services/_components/packages-pricing-section";
import { GalleriesHeaderSection } from "@/app/(public)/galleries/_components/galleries-header-section";
import { GalleriesPaginationSection } from "@/app/(public)/galleries/_components/galleries-pagination-section";
import { CollectionsBrowser } from "@/app/(public)/collections/_components/collections-browser";
import { GalleryDetailView } from "@/app/(public)/galleries/[slug]/_components/gallery-detail-view";
import { ContactInquiryFormSection } from "@/app/(public)/contact/_components/contact-inquiry-form-section";

let approveConfirm = false;
const agent = createAgent({
  allow: (step) => !step.confirm || approveConfirm,
});

const R2_BASE = "https://pub-b79d4510b2274749bab0c670fd9bdfa5.r2.dev";

function makePhoto(id: string, caption: string): PhotoRow {
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
    gallery_id: 1,
    gallery_title: "Coastal Horizons",
    gallery_slug: "coastal-horizons",
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

function makeCollection(id: number, name: string, slug: string): CollectionRow {
  return {
    id,
    name,
    slug,
    description: `${name} documentary photography coverage`,
    created_at: "2026-08-01T10:00:00.000Z",
  };
}

function makeShowcaseCollection(
  id: number,
  name: string,
  slug: string
): CollectionShowcaseRow {
  return {
    ...makeCollection(id, name, slug),
    updated_at: "2026-08-15T10:00:00.000Z",
    gallery_count: 2,
    photo_count: 24,
    preview_photos: [
      makePhoto(`${slug}-1`, `${name} frame 1`),
      makePhoto(`${slug}-2`, `${name} frame 2`),
    ],
  };
}

const sampleGalleries: GalleryRow[] = [
  {
    id: 1,
    title: "Coastal Horizons",
    slug: "coastal-horizons",
    description: "Eastern Cape coastal light",
    event_date: "2026-07-20",
    cover_image: `${R2_BASE}/coastal.webp`,
    cover_sizes: null,
    cover_width: 1280,
    cover_height: 853,
    is_public: true,
    created_at: "2026-07-21T00:00:00.000Z",
    photo_count: 14,
  },
];

beforeEach(() => {
  approveConfirm = false;
  mockPathname = "/";
  vi.clearAllMocks();
  submitContactMock.mockResolvedValue({ error: null });
  window.localStorage.clear();
});

describe("Services PackagesPricingSection", () => {
  it("filters packages by click and keyboard ArrowRight and renders unique inquiry links", async () => {
    const user = userEvent.setup();
    render(<PackagesPricingSection />);

    expect(screen.getByText("Traditional / White Weddings")).toBeTruthy();
    expect(screen.getByText("Graphic Design Poster")).toBeTruthy();

    const corpRadio = screen.getByRole("radio", {
      name: "Corporate & Branding",
    });
    await user.click(corpRadio);

    expect(screen.getByText("Corporate / Conferences")).toBeTruthy();
    expect(screen.getByText("Branding Photography")).toBeTruthy();
    expect(screen.queryByText("Traditional / White Weddings")).toBeNull();

    corpRadio.focus();
    await user.keyboard("{ArrowRight}");

    await waitFor(() => {
      expect(screen.getByText("Studio Shoots")).toBeTruthy();
      expect(screen.getByText("Graphic Design Poster")).toBeTruthy();
      expect(screen.queryByText("Corporate / Conferences")).toBeNull();
    });

    const studioLink = screen.getByRole("link", {
      name: /Inquire\s*about Studio Shoots/i,
    });
    const posterLink = screen.getByRole("link", {
      name: /Inquire\s*about Graphic Design Poster/i,
    });
    expect(studioLink.getAttribute("href")).toBe("/contact?service=studio");
    expect(posterLink.getAttribute("href")).toBe(
      "/contact?service=graphic_poster"
    );
  });
});

describe("GalleriesHeaderSection & GalleriesPaginationSection", () => {
  it("notifies collection filter changes and page navigation", async () => {
    const user = userEvent.setup();
    const onCollectionChange = vi.fn();
    const onPageChange = vi.fn();
    const collections = [
      makeCollection(1, "Weddings", "weddings"),
      makeCollection(2, "Sports", "sports"),
    ];

    render(
      <>
        <GalleriesHeaderSection
          collections={collections}
          selectedCollection="all"
          onCollectionChange={onCollectionChange}
          totalCount={25}
        />
        <GalleriesPaginationSection
          currentPage={1}
          pageCount={4}
          onPageChange={onPageChange}
        />
      </>
    );

    await user.click(screen.getByRole("radio", { name: "Weddings" }));
    expect(onCollectionChange).toHaveBeenCalledWith("weddings");

    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);

    await user.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});

describe("CollectionsBrowser", () => {
  it("filters collections by theme and renders R2 preview images", async () => {
    const user = userEvent.setup();
    const collections = [
      makeShowcaseCollection(1, "Weddings", "weddings"),
      makeShowcaseCollection(2, "Sports", "sports"),
      makeShowcaseCollection(3, "Nature", "nature"),
    ];

    render(<CollectionsBrowser collections={collections} />);

    const imgs = screen.getAllByRole("img");
    expect(imgs.length).toBeGreaterThan(0);
    expect(imgs[0].getAttribute("src")).toContain("r2.dev");

    await user.click(screen.getByRole("radio", { name: "Sports & Action" }));
    expect(screen.getByRole("heading", { name: "Sports" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Weddings" })).toBeNull();

    await user.click(
      screen.getByRole("radio", { name: "Celebrations & Events" })
    );
    expect(screen.getByRole("heading", { name: "Weddings" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Sports" })).toBeNull();
  });
});

describe("GalleryDetailView", () => {
  const gallery: GalleryWithPhotos = {
    id: 10,
    title: "Eastern Cape Classics",
    slug: "eastern-cape-classics",
    description: "Matchday and twilight portraits",
    event_date: "2026-08-10",
    cover_image: `${R2_BASE}/cover.webp`,
    cover_sizes: null,
    cover_width: 1280,
    cover_height: 853,
    is_public: true,
    created_at: "2026-08-11T00:00:00.000Z",
    photo_count: 2,
    collections: [makeCollection(1, "Nature", "nature")],
    photos: [
      makePhoto("p1", "Coastal Dusk"),
      makePhoto("p2", "Highland Dawn"),
    ],
  };

  it("persists favorites, filters to favorites, and supports lightbox ArrowRight and Escape", async () => {
    const user = userEvent.setup();
    render(
      <>
        <GalleryDetailView gallery={gallery} />
        <AppToaster />
      </>
    );

    const favButton = screen.getByRole("button", {
      name: "Favorite Coastal Dusk",
    });
    await user.click(favButton);

    expect(
      window.localStorage.getItem("tk-favorites-eastern-cape-classics")
    ).toBe(JSON.stringify(["p1"]));

    const filterToggle = screen.getByRole("button", {
      name: /Client Favorites/i,
    });
    await user.click(filterToggle);

    expect(screen.getByText("Showing 1 Client Favorite")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Open Highland Dawn in lightbox" })
    ).toBeNull();

    await user.click(
      screen.getByRole("button", { name: "Show All 2 Photos" })
    );

    const openFirst = screen.getByRole("button", {
      name: "Open Coastal Dusk in lightbox",
    });
    await user.click(openFirst);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeTruthy();
      expect(screen.getByText("01 / 02")).toBeTruthy();
    });

    await user.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(screen.getByText("02 / 02")).toBeTruthy();
    });

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });
});

describe("SiteHeader navigation", () => {
  it("opens the mobile drawer with DrawerTitle and marks the active route", async () => {
    const user = userEvent.setup();
    mockPathname = "/services";

    const navCollections = [makeCollection(1, "Nature", "nature")];

    render(
      <SiteHeaderShell
        desktopNav={
          <DesktopNavMenu
            galleries={sampleGalleries}
            collections={navCollections}
          />
        }
        mobileNav={
          <MobileNavDrawer
            collections={navCollections}
            isSignedIn={false}
          />
        }
      />
    );

    const desktopServices = screen.getByRole("link", { name: "Services" });
    expect(desktopServices.getAttribute("aria-current")).toBe("page");

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "TK Photography" })
      ).toBeTruthy();
    });

    const activeServiceLinks = screen
      .getAllByRole("link", { name: "Services" })
      .filter((el) => el.getAttribute("aria-current") === "page");
    expect(activeServiceLinks.length).toBeGreaterThanOrEqual(2);
  });
});

describe("ContactInquiryFormSection with createAgent", () => {
  it("shows preselected pricing badge and names every control cleanly in snapshot", () => {
    render(
      <>
        <ContactInquiryFormSection initialService="sport" />
        <AppToaster />
      </>
    );

    expect(screen.getByText("Est. R4 500 – R15 000")).toBeTruthy();

    const live = agent.snapshot().filter((c) => !c.offPage);
    const unnamed = live.filter((c) => !c.label);
    expect(unnamed).toEqual([]);

    const labels = live.map((c) => c.label);
    expect(labels).toContain("Full Name");
    expect(labels).toContain("Email Address");
    expect(labels).toContain("Service & Pricing Tier");
    expect(labels).toContain("Event Date / Location");
    expect(labels).toContain("Project Details & Vision");
    expect(labels).toContain("Send Inquiry");

    const submitControl = live.find((c) => c.label === "Send Inquiry");
    expect(submitControl?.confirm).toBe(
      "Sends your booking inquiry email to TK Media"
    );
  });

  it("validates required fields on empty submit before calling server action", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ContactInquiryFormSection />
        <AppToaster />
      </>
    );

    await user.click(screen.getByRole("button", { name: "Send Inquiry" }));

    expect(screen.getByText("Name is too short")).toBeTruthy();
    expect(screen.getByText("Invalid email")).toBeTruthy();
    expect(
      screen.getByText("Message should be at least 10 characters")
    ).toBeTruthy();
    expect(submitContactMock).not.toHaveBeenCalled();
  });

  it("fills fields via agent.act and honors data-agent-confirm before submitting", async () => {
    render(
      <>
        <ContactInquiryFormSection />
        <AppToaster />
      </>
    );

    await agent.act({
      steps: [
        { ref: "Full Name", action: "setValue", args: ["Sipho Mthembu"] },
        {
          ref: "Email Address",
          action: "setValue",
          args: ["sipho@example.com"],
        },
        {
          ref: "Service & Pricing Tier",
          action: "setValue",
          args: ["branding"],
        },
        {
          ref: "Event Date / Location",
          action: "setValue",
          args: ["22 Nov 2026 • Bhisho"],
        },
        {
          ref: "Project Details & Vision",
          action: "setValue",
          args: ["Looking for full brand campaign photography coverage."],
        },
      ],
    });

    await waitFor(() => {
      expect(screen.getByText("Est. R4 000 – R20 000")).toBeTruthy();
    });

    approveConfirm = false;
    await agent.act({
      steps: [{ ref: "Send Inquiry", action: "press" }],
    });
    expect(submitContactMock).not.toHaveBeenCalled();

    approveConfirm = true;
    await agent.act({
      steps: [{ ref: "Send Inquiry", action: "press" }],
    });

    await waitFor(() => {
      expect(submitContactMock).toHaveBeenCalledWith({
        name: "Sipho Mthembu",
        email: "sipho@example.com",
        service: "branding",
        message:
          "Event Date / Location: 22 Nov 2026 • Bhisho\n\nLooking for full brand campaign photography coverage.",
      });
      expect(trackContactFormMock).toHaveBeenCalledTimes(1);
      expect(trackServiceInquiryMock).toHaveBeenCalledWith("branding");
      expect(screen.getByText("Inquiry Received")).toBeTruthy();
      expect(
        screen.getByRole("button", { name: "Send Another Inquiry" })
      ).toBeTruthy();
    });
  });
});
