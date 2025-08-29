import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/server";
import { getAdmin } from "@/lib/queries/user";

export const metadata: Metadata = {
  title: "Protected Area | TK Media",
  description:
    "Protected area for authenticated users to access their private galleries and account information.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Protected Area | TK Media",
    description: "Protected area for authenticated users.",
    type: "website",
  },
  alternates: {
    canonical: "/protected",
  },
};

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const isAdmin = await getAdmin();

  if (isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>
        Hello <span>{data.claims.email}</span>
      </p>
      <LogoutButton />
    </div>
  );
}
