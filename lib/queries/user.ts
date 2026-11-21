import { connection } from "next/server";

import { createClient } from "../server";

export async function getCurrentUser() {
  try {
    // The Supabase client generates a session-scoped id when it is created, so
    // defer it to request time instead of prerendering.
    await connection();
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    return data?.claims ?? null;
  } catch {
    return null;
  }
}

export async function getAdmin() {
  try {
    await connection();
    const supabase = await createClient();
    const { data } = await supabase.rpc("is_admin");
    return data;
  } catch {
    return false;
  }
}
