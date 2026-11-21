import { createClient } from "../server";

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    return data?.claims ?? null;
  } catch {
    return null;
  }
}

export async function getAdmin() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("is_admin");
    return data;
  } catch {
    return false;
  }
}
