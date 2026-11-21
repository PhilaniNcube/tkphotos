import type { CollectionConfig } from "payload";

import { isAdmin } from "./access";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt"],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      maxLength: 60,
      unique: true,
    },
    {
      name: "legacyId",
      type: "number",
      index: true,
      unique: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Original Supabase tag id.",
      },
    },
  ],
};
