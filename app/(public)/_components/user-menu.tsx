"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JwtPayload } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/react/avatar";
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/react/menu";
import { Images, LogOut, ShieldCheck } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { createClient } from "@/lib/client";

export type SupabaseUserLike = JwtPayload & {
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

interface UserMenuProps {
  userData: SupabaseUserLike | null;
}

export function UserMenu({ userData }: UserMenuProps) {
  const router = useRouter();

  if (!userData) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <AppButton
          variant="ghost"
          size="sm"
          render={<Link href="/auth/login" />}
        >
          Login
        </AppButton>
        <AppButton
          variant="primary"
          size="sm"
          render={<Link href="/auth/sign-up" />}
        >
          Sign Up
        </AppButton>
      </div>
    );
  }

  const meta = userData.user_metadata || {};
  const first =
    (typeof meta.first_name === "string" && meta.first_name) ||
    (typeof userData.first_name === "string" ? userData.first_name : "");
  const last =
    (typeof meta.last_name === "string" && meta.last_name) ||
    (typeof userData.last_name === "string" ? userData.last_name : "");
  const fullName = [first, last].filter(Boolean).join(" ") || "Account";
  const email =
    (typeof userData.email === "string" && userData.email) ||
    (typeof meta.email === "string" ? meta.email : undefined);
  const avatarUrl =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof userData.avatar_url === "string" ? userData.avatar_url : undefined);
  const initials = ((first?.[0] || "A") + (last?.[0] || "")).toUpperCase();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <Menu>
      <MenuTrigger className="inline-flex h-9 items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-low px-2.5 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
        <Avatar
          aria-hidden="true"
          className="h-7 w-7 rounded-full bg-primary text-xs font-bold text-on-primary"
        >
          {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
          <AvatarFallback className="bg-primary text-on-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[8rem] truncate text-sm font-semibold sm:inline">
          {fullName}
        </span>
      </MenuTrigger>
      <MenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-1.5 shadow-xl"
      >
        <MenuGroup>
          <MenuGroupLabel className="flex flex-col px-2.5 py-2">
            <span className="text-sm font-semibold text-on-surface">
              {fullName}
            </span>
            {email && (
              <span className="truncate text-xs text-on-surface-variant">
                {email}
              </span>
            )}
          </MenuGroupLabel>
        </MenuGroup>
        <MenuSeparator className="my-1 h-px bg-outline-variant/50" />
        <MenuItem
          render={<Link href="/protected" />}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-on-surface hover:bg-surface-container data-[highlighted]:bg-surface-container"
        >
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Client Portal</span>
        </MenuItem>
        <MenuItem
          render={<Link href="/galleries" />}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-on-surface hover:bg-surface-container data-[highlighted]:bg-surface-container"
        >
          <Images className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Galleries</span>
        </MenuItem>
        <MenuSeparator className="my-1 h-px bg-outline-variant/50" />
        <MenuItem
          destructive
          onSelect={handleSignOut}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-error hover:bg-error-container/50 data-[highlighted]:bg-error-container/50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Sign Out</span>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
