// Zod schemas for validating inputs before persisting to the database.
// Gallery creation schema corresponds to the `galleries` table Insert type
// defined in `types.ts` (Database.public.Tables.galleries.Insert).

import { z } from "zod";

// Assumptions (can be adjusted):
// - title: 1-150 chars
// - slug: lowercase, 3-64 chars, letters, numbers, hyphens, no leading/trailing hyphen, no consecutive hyphens
// - description: optional, max 1000 chars
// - access_key: 6-64 chars, letters, numbers (extend if symbols are desired)
// - event_date: optional ISO date (YYYY-MM-DD) only (no time component)
// - cover_image: optional URL (can be a relative path or storage key; allow either)
// - is_public defaults to false if omitted.

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // enforces lowercase, no leading/trailing hyphen, no double hyphen
const accessKeyRegex = /^[A-Za-z0-9]{6,64}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // basic YYYY-MM-DD (additional validation via refine)

export const createGallerySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Title is required" })
      .max(150, { message: "Title must be at most 150 characters" }),
    slug: z
      .string()
      .trim()
      .min(3, { message: "Slug must be at least 3 characters" })
      .max(64, { message: "Slug must be at most 64 characters" })
      .regex(slugRegex, {
        message: "Slug must be lowercase, alphanumeric and hyphen separated",
      }),
    description: z
      .string()
      .trim()
      .max(1000, { message: "Description must be at most 1000 characters" })
      .optional()
      .nullable(),
    access_key: z.string().regex(accessKeyRegex, {
      message: "Access key must be 6-64 alphanumeric characters",
    }),
    is_public: z.boolean().optional().default(false),
    event_date: z
      .string()
      .trim()
      .regex(dateRegex, { message: "Event date must be in YYYY-MM-DD format" })
      .refine(
        (val) => {
          if (!val) return true; // optional/nullable
          const d = new Date(val + "T00:00:00Z");
          return !isNaN(d.getTime());
        },
        { message: "Event date must be a valid date" }
      )
      .optional()
      .nullable(),
    cover_image: z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          if (val.startsWith("http://") || val.startsWith("https://"))
            return true;
          return !/[\s]/.test(val);
        },
        { message: "Cover image must be a valid URL or storage key" }
      )
      .optional()
      .nullable(),
  })
  .strict();

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;

// Gallery update schema: requires an id and at least one other field to update.
// Mirrors the validation rules from create but all update fields are optional.
export const updateGallerySchema = z
  .object({
    id: z.number().int().positive({ message: "Valid gallery id required" }),
    title: z
      .string()
      .trim()
      .min(1, { message: "Title is required" })
      .max(150, { message: "Title must be at most 150 characters" })
      .optional(),
    slug: z
      .string()
      .trim()
      .min(3, { message: "Slug must be at least 3 characters" })
      .max(64, { message: "Slug must be at most 64 characters" })
      .regex(slugRegex, {
        message: "Slug must be lowercase, alphanumeric and hyphen separated",
      })
      .optional(),
    description: z
      .string()
      .trim()
      .max(1000, { message: "Description must be at most 1000 characters" })
      .optional()
      .nullable(),
    access_key: z
      .string()
      .regex(accessKeyRegex, {
        message: "Access key must be 6-64 alphanumeric characters",
      })
      .optional(),
    is_public: z.boolean().optional(),
    event_date: z
      .string()
      .trim()
      .regex(dateRegex, { message: "Event date must be in YYYY-MM-DD format" })
      .refine(
        (val) => {
          if (!val) return true; // optional/nullable
          const d = new Date(val + "T00:00:00Z");
          return !isNaN(d.getTime());
        },
        { message: "Event date must be a valid date" }
      )
      .optional()
      .nullable(),
    cover_image: z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          if (val.startsWith("http://") || val.startsWith("https://"))
            return true;
          return !/\s/.test(val);
        },
        { message: "Cover image must be a valid URL or storage key" }
      )
      .optional()
      .nullable(),
  })
  .strict()
  .refine(
    (data) => {
      const { id, ...rest } = data;
      return Object.values(rest).some((v) => v !== undefined);
    },
    { message: "At least one field (besides id) must be provided to update" }
  );

export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;

// ===================== Collections =====================
// Collection creation schema corresponds to `collections` table Insert type.
// Fields: name (required), slug (required), description (optional nullable), created_at auto DB, id auto.
export const createCollectionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(120, { message: "Name must be at most 120 characters" }),
    slug: z
      .string()
      .trim()
      .min(3, { message: "Slug must be at least 3 characters" })
      .max(64, { message: "Slug must be at most 64 characters" })
      .regex(slugRegex, {
        message: "Slug must be lowercase, alphanumeric and hyphen separated",
      }),
    description: z
      .string()
      .trim()
      .max(1000, { message: "Description must be at most 1000 characters" })
      .optional()
      .nullable(),
  })
  .strict();

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;

// Collection update schema: requires id and at least one other field.
export const updateCollectionSchema = z
  .object({
    id: z.number().int().positive({ message: "Valid collection id required" }),
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(120, { message: "Name must be at most 120 characters" })
      .optional(),
    slug: z
      .string()
      .trim()
      .min(3, { message: "Slug must be at least 3 characters" })
      .max(64, { message: "Slug must be at most 64 characters" })
      .regex(slugRegex, {
        message: "Slug must be lowercase, alphanumeric and hyphen separated",
      })
      .optional(),
    description: z
      .string()
      .trim()
      .max(1000, { message: "Description must be at most 1000 characters" })
      .optional()
      .nullable(),
  })
  .strict()
  .refine(
    (data) => {
      const { id, ...rest } = data;
      return Object.values(rest).some((v) => v !== undefined);
    },
    { message: "At least one field (besides id) must be provided to update" }
  );

export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;

// ===================== Tags =====================
// `tags` table: name (required), id auto.
export const createTagSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(60, { message: "Name must be at most 60 characters" })
      .regex(/^[A-Za-z0-9][A-Za-z0-9 _-]*$/, {
        message:
          "Name must start alphanumeric and may contain spaces, underscores, hyphens",
      }),
  })
  .strict();

export type CreateTagInput = z.infer<typeof createTagSchema>;

// Update tag: require id and at least one field (currently only name).
export const updateTagSchema = z
  .object({
    id: z.number().int().positive({ message: "Valid tag id required" }),
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(60, { message: "Name must be at most 60 characters" })
      .regex(/^[A-Za-z0-9][A-Za-z0-9 _-]*$/, {
        message:
          "Name must start alphanumeric and may contain spaces, underscores, hyphens",
      })
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      const { id, ...rest } = data;
      return Object.values(rest).some((v) => v !== undefined);
    },
    { message: "At least one field (besides id) must be provided to update" }
  );

export type UpdateTagInput = z.infer<typeof updateTagSchema>;

// ===================== Photos =====================
// `photos` table Insert: filename (req), storage_key (req), gallery_id (req),
// optional: caption (nullable), is_featured (default false), id (uuid generated), created_at (db default)
// Assumptions: id is a UUID v4 string if provided; filename limited to safe chars; storage_key may contain path segments.
const uuidV4Regex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
const filenameRegex = /^[A-Za-z0-9._-]{1,200}$/; // simple filename (no spaces, no path separators)
const storageKeyRegex = /^[A-Za-z0-9/._-]{3,400}$/; // allow folder paths

export const createPhotoSchema = z
  .object({
    filename: z.string().trim().regex(filenameRegex, {
      message:
        "Filename may only contain letters, numbers, dot, underscore, hyphen",
    }),
    storage_key: z
      .string()
      .trim()
      .refine(
        (v) => {
          // Accept either old-style relative keys (match regex) or full http(s) URLs (UploadThing)
          if (/^https?:\/\//i.test(v)) return true;
          if (!storageKeyRegex.test(v)) return false;
          return !v.includes("..");
        },
        {
          message:
            "Storage key must be a valid path (/ . _ -) or a full http(s) URL",
        }
      ),
    gallery_id: z
      .number()
      .int({ message: "Gallery id must be an integer" })
      .positive({ message: "Gallery id must be positive" }),
    caption: z
      .string()
      .trim()
      .max(500, { message: "Caption must be at most 500 characters" })
      .optional()
      .nullable(),
    is_featured: z.boolean().optional().default(false),
    id: z
      .string()
      .regex(uuidV4Regex, { message: "id must be a valid UUID v4" })
      .optional(),
    // Optional JSON metadata (e.g. width/height). Keep permissive; Supabase column is jsonb.
    metadata: z
      .any()
      .optional()
      .refine(
        (v) => {
          if (v === undefined || v === null) return true;
          // Allow primitive, array, or object. Basic recursion limit not enforced here.
          return true;
        },
        { message: "Invalid metadata" }
      )
      .nullable(),
  })
  .strict();

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;

// Update photo: require id and at least one other field.
export const updatePhotoSchema = z
  .object({
    id: z
      .string()
      .regex(uuidV4Regex, { message: "Valid photo id (UUID v4) required" }),
    filename: z
      .string()
      .trim()
      .regex(filenameRegex, {
        message:
          "Filename may only contain letters, numbers, dot, underscore, hyphen",
      })
      .optional(),
    storage_key: z
      .string()
      .trim()
      .refine(
        (v) => {
          if (/^https?:\/\//i.test(v)) return true;
          if (!storageKeyRegex.test(v)) return false;
          return !v.includes("..");
        },
        {
          message:
            "Storage key must be a valid path (/ . _ -) or a full http(s) URL",
        }
      )
      .optional(),
    gallery_id: z
      .number()
      .int({ message: "Gallery id must be an integer" })
      .positive({ message: "Gallery id must be positive" })
      .optional(),
    caption: z
      .string()
      .trim()
      .max(500, { message: "Caption must be at most 500 characters" })
      .optional()
      .nullable(),
    is_featured: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => {
      const { id, ...rest } = data;
      return Object.values(rest).some((v) => v !== undefined);
    },
    { message: "At least one field (besides id) must be provided to update" }
  );

export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;

export interface CreateGalleryState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}

export const initialCreateGalleryState: CreateGalleryState = {
  success: false,
  error: null,
};

// ===================== Photo Action State =====================
// Moved from server action file to avoid exporting non-action symbols there.
export interface CreatePhotoState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}

export const initialCreatePhotoState: CreatePhotoState = {
  success: false,
  error: null,
};

// ===================== Collection Action State =====================
export interface CreateCollectionState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}

export const initialCreateCollectionState: CreateCollectionState = {
  success: false,
  error: null,
};

// ================= Add gallery to collection =================
// Accepts FormData with fields: collection_id, gallery_id
// Validates existence & uniqueness (no duplicate pair) before insert.
export interface LinkGalleryState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}

export const initialLinkGalleryState: LinkGalleryState = {
  success: false,
  error: null,
};

export const linkGallerySchema = z
  .object({
    collection_id: z
      .string()
      .refine((v) => /^\d+$/.test(v), {
        message: "collection_id must be an integer",
      })
      .transform((v) => Number(v))
      .refine((n) => n > 0, { message: "collection_id must be positive" }),
    gallery_id: z
      .string()
      .refine((v) => /^\d+$/.test(v), {
        message: "gallery_id must be an integer",
      })
      .transform((v) => Number(v))
      .refine((n) => n > 0, { message: "gallery_id must be positive" }),
  })
  .strict();

// Canonical list of offered services (value identifiers kept simple; labels shown in UI)
export const SERVICE_OPTIONS = [
  {
    value: "anniversary_wedding",
    label: "Anniversary / Traditional / White Wedding (R6 000 – R30 000)",
  },
  { value: "sport", label: "Sport Photography (R4 500 – R15 000)" },
  {
    value: "corporate_event",
    label: "Corporate Events / Conferences (R6 000 – R20 000)",
  },
  { value: "studio", label: "Studio Shoots (R1 000 – R3 000)" },
  { value: "matric_dance", label: "Matric Dance (R2 000 – R15 000)" },
  { value: "branding", label: "Branding Photography (R4 000 – R20 000)" },
  {
    value: "entertainment_event",
    label: "Entertainment Event Photography (R5 000 – R30 000)",
  },
  {
    value: "social_media_mgmt",
    label: "Social Media Management (R3 000 – R10 000)",
  },
  { value: "graphic_poster", label: "Graphic Design Poster (R450)" },
];

export const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  service: z
    .enum([...(SERVICE_OPTIONS.map((o) => o.value) as [string, ...string[]])])
    .optional(),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
