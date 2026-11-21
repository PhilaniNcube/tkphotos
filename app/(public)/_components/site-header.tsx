import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { CollectionRow, GalleryRow } from "@/lib/media";
import { DesktopNavMenu } from "./desktop-nav-menu";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import { UserMenu, type SupabaseUserLike } from "./user-menu";

interface SiteHeaderProps {
  userData: SupabaseUserLike | null;
  navGalleries: GalleryRow[];
  navCollections: CollectionRow[];
}

export function SiteHeader({
  userData,
  navGalleries,
  navCollections,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-outline-variant/60 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-2.5 shrink-0">
          <MobileNavDrawer
            collections={navCollections}
            isSignedIn={Boolean(userData)}
          />
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.webp"
              alt="TK Media Logo"
              width={799}
              height={604}
              className="h-8 w-auto object-contain"
              priority
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-on-surface">
              TK Photography
            </span>
          </Link>
        </div>

        <div className="hidden md:block">
          <DesktopNavMenu
            galleries={navGalleries}
            collections={navCollections}
          />
        </div>

        <UserMenu userData={userData} />
      </div>
    </header>
  );
}
