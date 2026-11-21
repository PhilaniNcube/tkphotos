import * as React from "react";
import { Suspense } from "react";

import { getAllCollections } from "@/lib/queries/collections";
import { getGalleriesPaginated } from "@/lib/queries/galleries";
import { getCurrentUser } from "@/lib/queries/user";
import { DesktopNavMenu } from "./desktop-nav-menu";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import { SiteHeaderShell } from "./site-header-shell";

export function SiteHeader() {
  return (
    <SiteHeaderShell
      mobileNav={
        <Suspense fallback={<MobileNavFallback />}>
          <MobileNav />
        </Suspense>
      }
      desktopNav={
        <Suspense fallback={<DesktopNavFallback />}>
          <DesktopNav />
        </Suspense>
      }
    />
  );
}

async function MobileNav() {
  const [collectionsResult, userData] = await Promise.all([
    getAllCollections({
      orderBy: "created_at",
      ascending: false,
      limit: 8,
    }),
    getCurrentUser(),
  ]);

  return (
    <MobileNavDrawer
      collections={collectionsResult.data}
      isSignedIn={Boolean(userData)}
    />
  );
}

async function DesktopNav() {
  const [galleriesResult, collectionsResult] = await Promise.all([
    getGalleriesPaginated({
      page: 1,
      pageSize: 6,
      publicOnly: true,
      orderBy: "created_at",
      ascending: false,
    }),
    getAllCollections({
      orderBy: "created_at",
      ascending: false,
      limit: 8,
    }),
  ]);

  return (
    <DesktopNavMenu
      galleries={galleriesResult.data}
      collections={collectionsResult.data}
    />
  );
}

function MobileNavFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-10 w-10 animate-pulse rounded-full bg-surface-container md:hidden"
    />
  );
}

function DesktopNavFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-9 w-[26rem] max-w-[40vw] animate-pulse rounded-lg bg-surface-container"
    />
  );
}
