import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";

const {
  mockCacheLife,
  mockCacheTag,
  mockPayloadFind,
  mockPayloadCount,
  mockSubmitContact,
  mockTrackContactForm,
  mockTrackServiceInquiry,
} = vi.hoisted(() => ({
  mockCacheLife: vi.fn(),
  mockCacheTag: vi.fn(),
  mockPayloadFind: vi.fn(),
  mockPayloadCount: vi.fn(),
  mockSubmitContact: vi.fn(),
  mockTrackContactForm: vi.fn(),
  mockTrackServiceInquiry: vi.fn(),
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

vi.mock("@/lib/payload", () => ({
  getPayloadClient: async () => ({
    find: mockPayloadFind,
    count: mockPayloadCount,
  }),
}));

vi.mock("@/lib/actions/contact", () => ({
  submitContact: mockSubmitContact,
}));

vi.mock("@/lib/analytics", () => ({
  trackContactForm: mockTrackContactForm,
  trackServiceInquiry: mockTrackServiceInquiry,
}));

import type { PhotoRow } from "@/lib/media";
import { getServicesHeroMedia } from "@/lib/queries/editorial-media";
import { getActiveServices } from "@/lib/queries/services";
import {
  DEFAULT_SERVICES,
  toServiceSelectOption,
  type ServicePackageItem,
} from "@/lib/services-data";
import { ServicesHeroSection } from "@/app/(public)/services/_components/services-hero-section";
import { PackagesPricingSection } from "@/app/(public)/services/_components/packages-pricing-section";
import { ContactInquiryFormSection } from "@/app/(public)/contact/_components/contact-inquiry-form-section";
import { AppToaster } from "@/components/ui-sdk/app-toaster";

const R2_BASE = "https://pub-b79d4510b2274749bab0c670fd9bdfa5.r2.dev";

function makePhoto(id: string, alt: string, slug: string): PhotoRow {
  const url = `${R2_BASE}/${slug}-${id}.webp`;
  return {
    id,
    filename: `${slug}-${id}.webp`,
    storage_key: url,
    url,
    caption: alt,
    alt,
    created_at: "2026-08-12T10:00:00.000Z",
    is_featured: true,
    gallery_id: 1,
    gallery_title: slug,
    gallery_slug: slug,
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

function makeMediaDoc(id: number, alt: string, slug: string) {
  const url = `${R2_BASE}/${slug}-${id}.webp`;
  return {
    id,
    filename: `${slug}-${id}.webp`,
    url,
    alt,
    caption: alt,
    width: 1600,
    height: 1067,
    mimeType: "image/webp",
    isFeatured: true,
    createdAt: "2026-08-12T10:00:00.000Z",
    updatedAt: "2026-08-12T10:00:00.000Z",
    sizes: {
      thumbnail: { url, width: 480, height: 320, mimeType: "image/webp" },
      medium: { url, width: 1280, height: 853, mimeType: "image/webp" },
      full: { url, width: 2560, height: 1707, mimeType: "image/webp" },
    },
  };
}

let approveConfirm = false;
const agent = createAgent({
  allow: (step) => !step.confirm || approveConfirm,
});

beforeEach(() => {
  approveConfirm = false;
  vi.clearAllMocks();
  mockSubmitContact.mockResolvedValue({ error: null });
});

describe("ServicesHeroSection & getServicesHeroMedia", () => {
  it("renders Weddings & Events, Festivals, and Conferences & Corporate Media cards without old titles", () => {
    const cards = [
      {
        label: "Weddings & Events",
        slug: "white-wedding",
        photo: makePhoto("1", "White wedding couple", "white-wedding"),
      },
      {
        label: "Festivals",
        slug: "music-in-the-snow",
        photo: makePhoto("2", "Festival stage lighting", "music-in-the-snow"),
      },
      {
        label: "Conferences & Corporate Media",
        slug: "vice-chancellor-s-breakfast",
        photo: makePhoto(
          "3",
          "Conference keynote address",
          "vice-chancellor-s-breakfast"
        ),
      },
    ];

    render(<ServicesHeroSection cards={cards} />);

    expect(
      screen.getByRole("link", { name: /Weddings & Events/i }).getAttribute("href")
    ).toBe("/galleries/white-wedding");
    expect(
      screen.getByRole("link", { name: /Festivals/i }).getAttribute("href")
    ).toBe("/galleries/music-in-the-snow");
    expect(
      screen
        .getByRole("link", { name: /Conferences & Corporate Media/i })
        .getAttribute("href")
    ).toBe("/galleries/vice-chancellor-s-breakfast");

    expect(screen.queryByText("Sports & Action")).toBeNull();
    expect(screen.queryByText("Corporate & Media")).toBeNull();
  });

  it("queries galleries for white-wedding, music-in-the-snow, and vice-chancellor-s-breakfast and caches result", async () => {
    mockPayloadFind.mockImplementation(async (args: Record<string, unknown>) => {
      if (args.collection === "galleries") {
        const where = args.where as {
          and?: Array<{ slug?: { equals?: string } }>;
        };
        const slug = where?.and?.[0]?.slug?.equals ?? "";
        return {
          docs: [
            {
              id: 10,
              title: slug,
              slug,
              isPublic: true,
              coverImage: makeMediaDoc(10, `${slug} cover`, slug),
            },
          ],
        };
      }
      return { docs: [] };
    });

    const cards = await getServicesHeroMedia();

    expect(mockCacheLife).toHaveBeenCalledWith("minutes");
    expect(mockCacheTag).toHaveBeenCalledWith("services", "services-hero");
    expect(cards.map((c) => ({ label: c.label, slug: c.slug }))).toEqual([
      { label: "Weddings & Events", slug: "white-wedding" },
      { label: "Festivals", slug: "music-in-the-snow" },
      {
        label: "Conferences & Corporate Media",
        slug: "vice-chancellor-s-breakfast",
      },
    ]);
    expect(cards.every((c) => c.photo !== null)).toBe(true);
  });
});

describe("Services Payload queries & CMS-driven components", () => {
  const customImage = makeMediaDoc(
    321,
    "Aerial view of a coastal resort launch",
    "drone"
  );

  const customService: ServicePackageItem = {
    id: 99,
    slug: "drone_aerial",
    title: "Aerial & Drone Coverage",
    category: "commercial",
    badge: "Aerial",
    description: "CAA-compliant 4K aerial coverage for venues and campaigns.",
    rateLabel: "Rate Range",
    rate: "R3 500 – R12 000",
    icon: "film",
    featuredImage: customImage,
    featured: false,
    isActive: true,
    sortOrder: 45,
  };

  it("getActiveServices queries active services sorted by sortOrder and tags cache", async () => {
    mockPayloadFind.mockResolvedValueOnce({
      docs: [
        {
          ...customService,
          createdAt: "2026-11-22T00:00:00.000Z",
          updatedAt: "2026-11-22T00:00:00.000Z",
        },
      ],
    });

    const services = await getActiveServices();

    expect(mockCacheLife).toHaveBeenCalledWith("minutes");
    expect(mockCacheTag).toHaveBeenCalledWith("services");
    expect(mockPayloadFind).toHaveBeenCalledWith({
      collection: "services",
      where: { isActive: { equals: true } },
      sort: "sortOrder",
      limit: 100,
      depth: 1,
      overrideAccess: true,
    });
    expect(services).toEqual([customService]);
  });

  it("maps a populated featured image into the service view model", async () => {
    const image = makeMediaDoc(
      321,
      "Aerial coverage at a coastal resort",
      "drone"
    );

    mockPayloadFind.mockResolvedValueOnce({
      docs: [{ ...customService, featuredImage: image }],
    });

    const [service] = await getActiveServices();

    expect(service.featuredImage).toEqual(image);
  });

  it("getActiveServices falls back to DEFAULT_SERVICES when unseeded or on query error", async () => {
    mockPayloadFind.mockResolvedValueOnce({ docs: [] });
    mockPayloadCount.mockResolvedValueOnce({ totalDocs: 0 });

    const unseeded = await getActiveServices();
    expect(unseeded).toEqual(DEFAULT_SERVICES);

    mockPayloadFind.mockResolvedValueOnce({ docs: [] });
    mockPayloadCount.mockResolvedValueOnce({ totalDocs: 3 });

    const allInactive = await getActiveServices();
    expect(allInactive).toEqual([]);

    mockPayloadFind.mockRejectedValueOnce(new Error("DB offline"));
    const onError = await getActiveServices();
    expect(onError).toEqual(DEFAULT_SERVICES);
  });

  it("PackagesPricingSection renders custom CMS packages, filters by category, and names all controls for agents", async () => {
    const user = userEvent.setup();
    const packages = [...DEFAULT_SERVICES, customService];

    render(<PackagesPricingSection packages={packages} />);

    expect(screen.getByText("Aerial & Drone Coverage")).toBeTruthy();
    expect(
      screen.getByRole("img", { name: /Aerial & Drone Coverage — Aerial/i })
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: /Inquire\s*about Aerial & Drone Coverage/i })
        .getAttribute("href")
    ).toBe("/contact?service=drone_aerial");

    await user.click(
      screen.getByRole("radio", { name: "Corporate & Branding" })
    );

    expect(screen.getByText("Aerial & Drone Coverage")).toBeTruthy();
    expect(screen.getByText("Corporate / Conferences")).toBeTruthy();
    expect(screen.queryByText("Traditional / White Weddings")).toBeNull();

    const live = agent
      .snapshot()
      .filter((c) => !c.offPage && c.component !== "more");
    const unnamed = live.filter((c) => !c.label);
    expect(unnamed).toEqual([]);
  });

  it("ContactInquiryFormSection works with custom CMS serviceOptions", async () => {
    const options = [
      ...DEFAULT_SERVICES.map(toServiceSelectOption),
      toServiceSelectOption(customService),
    ];

    render(
      <>
        <ContactInquiryFormSection
          initialService="drone_aerial"
          serviceOptions={options}
        />
        <AppToaster />
      </>
    );

    expect(screen.getByText("Est. R3 500 – R12 000")).toBeTruthy();

    approveConfirm = true;
    await agent.act({
      steps: [
        { ref: "Full Name", action: "setValue", args: ["Nomsa Dlamini"] },
        {
          ref: "Email Address",
          action: "setValue",
          args: ["nomsa@example.com"],
        },
        {
          ref: "Project Details & Vision",
          action: "setValue",
          args: ["Need aerial coverage for our coastal resort launch."],
        },
        { ref: "Send Inquiry", action: "press" },
      ],
    });

    await waitFor(() => {
      expect(mockSubmitContact).toHaveBeenCalledWith({
        name: "Nomsa Dlamini",
        email: "nomsa@example.com",
        service: "drone_aerial",
        message: "Need aerial coverage for our coastal resort launch.",
      });
      expect(screen.getByText("Inquiry Received")).toBeTruthy();
    });
  });
});
