"use client";

import { JwtPayload } from "@supabase/supabase-js";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/logout-button";

type SupabaseUserLike = JwtPayload & {
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

interface UserButtonProps {
  userData: SupabaseUserLike | null;
}

const UserButton = ({ userData }: UserButtonProps) => {
  // If no user data, show auth action buttons
  if (!userData) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link href="/auth/sign-up">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    );
  }

  const meta = userData.user_metadata || {};
  const first = meta.first_name || (userData as any).first_name || "";
  const last = meta.last_name || (userData as any).last_name || "";
  const fullName = [first, last].filter(Boolean).join(" ") || "Account";
  const email = userData.email || (userData as any).email || meta.email;
  const avatarUrl = meta.avatar_url || (userData as any).avatar_url;
  const initials = (first?.[0] || "A") + (last?.[0] || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2"
        >
          <Avatar className="size-7">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
            <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline max-w-[8rem] truncate text-sm font-medium">
            {fullName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium leading-tight">{fullName}</span>
          {email && (
            <span className="text-muted-foreground text-xs font-normal truncate">
              {email}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/protected">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/galleries">Galleries</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <LogoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
