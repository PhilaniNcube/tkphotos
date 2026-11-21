import type { CollectionConfig } from "payload";

import { isAdmin } from "./access";
import { slugField } from "./fields/slug";

export const PhotoCollections: CollectionConfig = {
  slug: "photo-collections",
  labels: {
    singular: "Collection",
    plural: "Collections",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
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
      maxLength: 120,
    },
    slugField({ sourceField: "name" }),
    {
      name: "description",
      type: "textarea",
      maxLength: 1000,
    },
    {
      name: "galleries",
      type: "relationship",
      relationTo: "galleries",
      hasMany: true,
    },
    {
      name: "legacyId",
      type: "number",
      index: true,
      unique: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Original Supabase collection id.",
      },
    },
  ],
};
