"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ContactInput, contactSchema } from "../schema";

export async function submitContact(formData: ContactInput) {
  const parsed = contactSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    } as const;
  }
  try {
    // Placeholder: Integrate email (Resend / SMTP) or DB persistence (Supabase) later.
    console.log("Contact submission", parsed.data);
    revalidatePath("/contact");
    return { error: null } as const;
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unexpected error",
    } as const;
  }
}
