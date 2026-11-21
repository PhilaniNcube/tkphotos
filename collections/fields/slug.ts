import type { Field } from "payload";

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 64);
}

/** Reusable slug field that auto-fills from a source text field when empty. */
export function slugField({
  sourceField = "title",
}: {
  sourceField?: string;
} = {}): Field {
  return {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    minLength: 3,
    maxLength: 64,
    admin: {
      position: "sidebar",
      description:
        "Lowercase, alphanumeric and hyphen separated. Auto-generated from the title when left blank.",
    },
    hooks: {
      beforeValidate: [
        ({ data, value }) => {
          if (typeof value === "string" && value.trim().length > 0) {
            return slugify(value);
          }
          const source = data?.[sourceField];
          if (typeof source === "string" && source.trim().length > 0) {
            return slugify(source);
          }
          return value;
        },
      ],
    },
  };
}
