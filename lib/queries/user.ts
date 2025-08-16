import { createClient } from "../server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (!data) return null;

  return data.claims;
}

export async function getAdmin() {
  const supabase = await createClient();

  const { data } = await supabase.rpc("is_admin");

  return data;
}
