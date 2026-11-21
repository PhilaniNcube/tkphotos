import type { CollectionConfig } from "payload";

import { isAdmin } from "./access";

/**
 * Media is the single upload collection for every image on the site.
 *
 * Each upload produces three web-optimised sizes (see `imageSizes`) plus the
 * untouched original, so the frontend can choose the cheapest size that still
 * looks sharp for the context:
 *
 * - thumbnail — 480px wide: masonry grids, admin thumbs, cards
 * - medium    — 1280px wide: gallery grids, featured work, social previews
 * - full      — 2560px wide: lightbox / full-screen viewing
 *
 * Variants are encoded as WebP by sharp and uploaded to R2 alongside the
 * original by the S3 storage adapter.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "gallery", "isFeatured", "createdAt"],
    listSearchableFields: ["filename", "caption", "alt"],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    mimeTypes: ["image/*"],
    focalPoint: true,
    adminThumbnail: "thumbnail",
    imageSizes: [
      {
        name: "thumbnail",
        width: 480,
        formatOptions: {
          format: "webp",
          options: { quality: 80 },
        },
      },
      {
        name: "medium",
        width: 1280,
        formatOptions: {
          format: "webp",
          options: { quality: 82 },
        },
      },
      {
        name: "full",
        width: 2560,
        formatOptions: {
          format: "webp",
          options: { quality: 85 },
        },
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      maxLength: 200,
      admin: {
        description: "Describe the image for screen readers and SEO.",
      },
    },
    {
      name: "caption",
      type: "textarea",
      maxLength: 500,
    },
    {
      name: "gallery",
      type: "relationship",
      relationTo: "galleries",
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "legacyId",
      type: "text",
      index: true,
      unique: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Original Supabase photo UUID.",
      },
    },
    {
      name: "legacyUrl",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Original UploadThing URL. Used only by the migrator.",
      },
    },
  ],
};
