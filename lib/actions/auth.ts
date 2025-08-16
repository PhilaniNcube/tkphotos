"use server";

import { createClient } from "../server";
import { revalidatePath } from "next/cache";

interface LoginArgs {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginArgs) {
  if (!email || !password) {
    return { error: "Email and password are required" } as const;
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message } as const;
    }
    // Revalidate public layout & protected route so user state updates immediately.
    revalidatePath("/", "layout");
    revalidatePath("/protected");
    return { error: null } as const;
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unexpected error",
    } as const;
  }
}
