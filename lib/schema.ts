import { z } from "zod";

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
