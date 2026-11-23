import type { Access, CollectionConfig } from "payload";

import { isStaff } from "./access";
import { slugField } from "./fields/slug";

const publicOrStaffRead: Access = ({ req }) => {
  if (req.user) return true;
  return { isPublic: { equals: true } };
};

export const Galleries: CollectionConfig = {
  slug: "galleries",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "eventDate", "isPublic"],
  },
  access: {
    read: publicOrStaffRead,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
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
      name: "description",
      type: "textarea",
      maxLength: 1000,
    },
    {
      name: "accessKey",
      type: "text",
      admin: {
        description:
          "Optional client access key. 6-64 alphanumeric characters.",
        position: "sidebar",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true;
        return /^[A-Za-z0-9]{6,64}$/.test(value)
          ? true
          : "Access key must be 6-64 alphanumeric characters";
      },
    },
    {
      name: "isPublic",
      type: "checkbox",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "eventDate",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "coverImage",
      type: "relationship",
      relationTo: "media",
      admin: {
        description: "Used for gallery cards, social previews and headers.",
      },
    },
    {
      // Virtual reverse relationship: shows every Media doc whose `gallery`
      // points at this gallery. `allowCreate` lets you upload a new image
      // directly from the gallery screen; Payload pre-fills `gallery`.
      name: "photos",
      type: "join",
      collection: "media",
      on: "gallery",
      label: "Photos",
      defaultLimit: 24,
      defaultSort: "-createdAt",
      admin: {
        defaultColumns: ["filename", "caption", "isFeatured", "updatedAt"],
      },
    },
    {
      name: "legacyId",
      type: "number",
      index: true,
      unique: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description:
          "Original Supabase row id. Kept for migration traceability.",
      },
    },
  ],
};
