"use client";

import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh(); // Refresh the page to update user state
  };

  return (
    <Button className="w-full max-w-[200px]" onClick={logout}>
      Logout
    </Button>
  );
}
