import { z } from "zod";
import {
  DEFAULT_SERVICES,
  toServiceSelectOption,
  type ServiceSelectOption,
} from "./services-data";

export type { ServiceSelectOption };

// Canonical fallback list of offered services when CMS rows are unavailable.
export const SERVICE_OPTIONS: ServiceSelectOption[] =
  DEFAULT_SERVICES.map(toServiceSelectOption);

export const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  service: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9][a-z0-9_-]*$/, "Invalid service selection")
    .optional(),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
