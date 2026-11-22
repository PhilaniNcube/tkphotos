import type { Access, CollectionConfig } from "payload";

import { isAdmin } from "./access";
import { slugField } from "./fields/slug";

/**
 * Cached so the cutoff can be part of the prerender. A scheduled post can
 * appear up to one default cache lifetime (15 minutes) late.
 */
async function getPublishCutoff(): Promise<string> {
  "use cache";
  return new Date().toISOString();
}

/**
 * Public visitors only see published posts whose publish date has arrived.
 * Logged-in staff can read drafts and scheduled posts from the admin panel.
 */
const publicOrStaffRead: Access = async ({ req }) => {
  if (req.user) return true;
  return {
    status: { equals: "published" },
    publishedAt: { less_than_equal: await getPublishCutoff() },
  };
};

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Blog Post",
    plural: "Blog Posts",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "publishedAt", "author"],
    listSearchableFields: ["title", "excerpt", "author"],
  },
  defaultSort: "-publishedAt",
  access: {
    read: publicOrStaffRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 150,
    },
    slugField({ sourceField: "title" }),
    {
      name: "excerpt",
      type: "textarea",
      maxLength: 320,
      admin: {
        description:
          "Short summary shown on the blog index and in search results.",
      },
    },
    {
      name: "coverImage",
      type: "relationship",
      relationTo: "media",
      admin: {
        description: "Used for the blog card, post header and social previews.",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "author",
      type: "text",
      maxLength: 80,
      defaultValue: "TK Media",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      index: true,
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        description:
          "Posts appear on the public blog from this date once published.",
        date: {
          pickerAppearance: "dayAndTime",
        },
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
  ],
};
