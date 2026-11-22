import type { Media } from "@/payload-types";

export type ServiceCategory = "events" | "commercial" | "studio";

export type ServiceRateLabel = "Rate Range" | "Flat Rate" | "Starting From";

export type ServiceIconName =
  | "heart"
  | "briefcase"
  | "music"
  | "trophy"
  | "palette"
  | "sparkles"
  | "share2"
  | "camera"
  | "pen-tool"
  | "film"
  | "presentation"
  | "users";

export interface ServicePackageItem {
  id?: number;
  slug: string;
  title: string;
  category: ServiceCategory;
  badge: string;
  description: string;
  rateLabel: ServiceRateLabel;
  rate: string;
  icon: ServiceIconName;
  featuredImage?: Media | null;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ServiceSelectOption {
  value: string;
  label: string;
  title: string;
  rate: string;
}

export const DEFAULT_SERVICES: ServicePackageItem[] = [
  {
    slug: "anniversary_wedding",
    title: "Traditional / White Weddings",
    category: "events",
    badge: "Events",
    description:
      "Full-day ceremony, lobola, reception coverage, and bridal portraits.",
    rateLabel: "Rate Range",
    rate: "R6 000 – R30 000",
    icon: "heart",
    featured: false,
    isActive: true,
    sortOrder: 10,
  },
  {
    slug: "corporate_event",
    title: "Corporate / Conferences",
    category: "commercial",
    badge: "Corporate",
    description:
      "Multi-day summits, keynotes, brand panels, and executive headshots.",
    rateLabel: "Rate Range",
    rate: "R6 000 – R20 000",
    icon: "briefcase",
    featured: false,
    isActive: true,
    sortOrder: 20,
  },
  {
    slug: "entertainment_event",
    title: "Entertainment Events",
    category: "events",
    badge: "Entertainment",
    description: "Concerts, festivals, nightlife, and live stage performances.",
    rateLabel: "Rate Range",
    rate: "R5 000 – R30 000",
    icon: "music",
    featured: false,
    isActive: true,
    sortOrder: 30,
  },
  {
    slug: "sport",
    title: "Sports Photography",
    category: "events",
    badge: "Action",
    description:
      "Tournaments, league fixtures, sideline action, and athletic branding.",
    rateLabel: "Rate Range",
    rate: "R4 500 – R15 000",
    icon: "trophy",
    featured: false,
    isActive: true,
    sortOrder: 40,
  },
  {
    slug: "branding",
    title: "Branding Photography",
    category: "commercial",
    badge: "Commercial",
    description:
      "Product lookbooks, founder portraits, and bespoke campaign visuals.",
    rateLabel: "Rate Range",
    rate: "R4 000 – R20 000",
    icon: "palette",
    featured: false,
    isActive: true,
    sortOrder: 50,
  },
  {
    slug: "matric_dance",
    title: "Matric Dance",
    category: "events",
    badge: "Milestone",
    description:
      "Red-carpet arrivals, couple portraits, and celebratory coverage.",
    rateLabel: "Rate Range",
    rate: "R2 000 – R15 000",
    icon: "sparkles",
    featured: false,
    isActive: true,
    sortOrder: 60,
  },
  {
    slug: "social_media_mgmt",
    title: "Social Media Management",
    category: "commercial",
    badge: "Digital",
    description: "Monthly visual content production, scheduling & strategy.",
    rateLabel: "Rate Range",
    rate: "R3 000 – R10 000",
    icon: "share2",
    featured: false,
    isActive: true,
    sortOrder: 70,
  },
  {
    slug: "studio",
    title: "Studio Shoots",
    category: "studio",
    badge: "Studio",
    description:
      "Controlled lighting for portraits, maternity, and family sessions.",
    rateLabel: "Rate Range",
    rate: "R1 000 – R3 000",
    icon: "camera",
    featured: false,
    isActive: true,
    sortOrder: 80,
  },
  {
    slug: "graphic_poster",
    title: "Graphic Design Poster",
    category: "studio",
    badge: "Design",
    description:
      "High-impact event flyers, social announcement tiles & print posters.",
    rateLabel: "Flat Rate",
    rate: "R450",
    icon: "pen-tool",
    featured: true,
    isActive: true,
    sortOrder: 90,
  },
];

/** Converts a service package into an option for the contact inquiry select field. */
export function toServiceSelectOption(
  service: Pick<ServicePackageItem, "slug" | "title" | "rate">
): ServiceSelectOption {
  return {
    value: service.slug,
    label: `${service.title} (${service.rate})`,
    title: service.title,
    rate: service.rate,
  };
}
