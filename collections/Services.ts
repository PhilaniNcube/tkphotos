import type {
  Access,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from "payload";

import { isStaff } from "./access";
import { slugify } from "./fields/slug";

const activeOrStaffRead: Access = ({ req }) => {
  if (req.user) return true;
  return { isActive: { equals: true } };
};

async function revalidateServicesCache(context?: Record<string, unknown>) {
  if (context?.disableRevalidate) return;
  try {
    const { revalidateTag } = await import("next/cache");
    revalidateTag("services", { expire: 0 });
  } catch {
    // Outside the Next.js server runtime (e.g. Payload CLI or seed scripts), cache invalidation is a no-op.
  }
}

const afterChangeHook: CollectionAfterChangeHook = async ({ doc, req }) => {
  await revalidateServicesCache(req.context);
  return doc;
};

const afterDeleteHook: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidateServicesCache(req.context);
  return doc;
};

export const Services: CollectionConfig = {
  slug: "services",
  labels: {
    singular: "Service",
    plural: "Services",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "featuredImage",
      "category",
      "rate",
      "isActive",
      "sortOrder",
    ],
    listSearchableFields: ["title", "slug", "badge", "description"],
  },
  defaultSort: "sortOrder",
  access: {
    read: activeOrStaffRead,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      minLength: 2,
      maxLength: 64,
      admin: {
        position: "sidebar",
        description:
          "Stable query identifier (e.g. anniversary_wedding). Preserves underscores and hyphens.",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return "Service slug is required";
        return /^[a-z0-9][a-z0-9_-]{1,63}$/.test(value)
          ? true
          : "Slug must be 2-64 lowercase letters, numbers, hyphens, or underscores";
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (typeof value === "string" && value.trim().length > 0) {
              return value
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9_-]+/g, "-")
                .replace(/^[-_]+|[-_]+$/g, "")
                .slice(0, 64);
            }
            const source = data?.title;
            if (typeof source === "string" && source.trim().length > 0) {
              return slugify(source);
            }
            return value;
          },
        ],
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      index: true,
      defaultValue: "events",
      options: [
        { label: "Events & Weddings", value: "events" },
        { label: "Corporate & Branding", value: "commercial" },
        { label: "Studio & Design", value: "studio" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "badge",
      type: "text",
      required: true,
      maxLength: 40,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      maxLength: 400,
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      index: true,
      displayPreview: true,
      // Enforced in Payload rather than at the database level so the column can
      // be added to databases that already contain services.
      validate: (value: unknown) =>
        value ? true : "A featured image is required for every service.",
      admin: {
        description:
          "Primary image for this service. Used on package cards, listings, and social previews.",
      },
    },
    {
      name: "rateLabel",
      type: "select",
      required: true,
      defaultValue: "Rate Range",
      options: [
        { label: "Rate Range", value: "Rate Range" },
        { label: "Flat Rate", value: "Flat Rate" },
        { label: "Starting From", value: "Starting From" },
      ],
    },
    {
      name: "rate",
      type: "text",
      required: true,
      maxLength: 60,
      admin: {
        description: "Formatted ZAR rate, e.g. R6 000 – R30 000 or R450.",
      },
    },
    {
      name: "icon",
      type: "select",
      required: true,
      defaultValue: "camera",
      options: [
        { label: "Heart", value: "heart" },
        { label: "Briefcase", value: "briefcase" },
        { label: "Music", value: "music" },
        { label: "Trophy", value: "trophy" },
        { label: "Palette", value: "palette" },
        { label: "Sparkles", value: "sparkles" },
        { label: "Share2", value: "share2" },
        { label: "Camera", value: "camera" },
        { label: "Pen Tool", value: "pen-tool" },
        { label: "Film", value: "film" },
        { label: "Presentation", value: "presentation" },
        { label: "Users", value: "users" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      required: true,
      defaultValue: 100,
      index: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
};
