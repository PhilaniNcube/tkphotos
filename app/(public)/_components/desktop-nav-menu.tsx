"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu";
import { ArrowRight, ChevronDown, Images, Layers } from "lucide-react";
import type { CollectionRow, GalleryRow } from "@/lib/media";
import { cn } from "@/lib/utils";

interface DesktopNavMenuProps {
  galleries: GalleryRow[];
  collections: CollectionRow[];
}

const staticLinks: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog" as Route, label: "Blog" },
];

export function DesktopNavMenu({
  galleries,
  collections,
}: DesktopNavMenuProps) {
  const pathname = usePathname();

  return (
    <NavigationMenu aria-label="Main navigation" className="relative">
      <NavigationMenuList className="flex items-center gap-1">
        {staticLinks.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                render={<Link href={item.href} />}
                current={isCurrent}
                className={cn(
                  "inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium transition-colors",
                  isCurrent
                    ? "bg-primary-fixed/60 font-semibold text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}

        <NavigationMenuItem value="galleries">
          <NavigationMenuTrigger
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors cursor-pointer border-0 bg-transparent",
              pathname.startsWith("/galleries")
                ? "bg-primary-fixed/60 font-semibold text-primary"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            <span>Galleries</span>
            <ChevronDown
              className="h-3.5 w-3.5 transition-transform duration-200 [[data-open]_&]:rotate-180"
              aria-hidden="true"
            />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-[340px] bg-surface-container-lowest p-3">
            <div className="mb-2 rounded-lg bg-primary-fixed/40 p-2.5">
              <NavigationMenuLink
                render={<Link href="/galleries" />}
                current={pathname === "/galleries"}
                className="flex flex-row items-center justify-between gap-2 rounded-md p-1.5 text-sm font-semibold text-primary hover:bg-primary-fixed/70"
              >
                <span className="flex items-center gap-2">
                  <Images className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>All Galleries</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </NavigationMenuLink>
            </div>
            {galleries.length > 0 && (
              <ul className="flex flex-col gap-0.5 !w-full">
                {galleries.map((gallery) => {
                  const href = `/galleries/${gallery.slug}` as Route;
                  return (
                    <li key={gallery.id}>
                      <NavigationMenuLink
                        render={<Link href={href} />}
                        current={pathname === href}
                        className="flex flex-col gap-0.5 rounded-lg px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
                      >
                        <span className="truncate font-semibold text-on-surface">
                          {gallery.title}
                        </span>
                        {gallery.description && (
                          <span className="line-clamp-1 text-xs text-on-surface-variant">
                            {gallery.description}
                          </span>
                        )}
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem value="collections">
          <NavigationMenuTrigger
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors cursor-pointer border-0 bg-transparent",
              pathname.startsWith("/collections")
                ? "bg-primary-fixed/60 font-semibold text-primary"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            <span>Collections</span>
            <ChevronDown
              className="h-3.5 w-3.5 transition-transform duration-200 [[data-open]_&]:rotate-180"
              aria-hidden="true"
            />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-[320px] bg-surface-container-lowest p-3">
            <div className="mb-2 rounded-lg bg-primary-fixed/40 p-2.5">
              <NavigationMenuLink
                render={<Link href="/collections" />}
                current={pathname === "/collections"}
                className="flex flex-row items-center justify-between gap-2 rounded-md p-1.5 text-sm font-semibold text-primary hover:bg-primary-fixed/70"
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>All Collections</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </NavigationMenuLink>
            </div>
            {collections.length > 0 && (
              <ul className="flex flex-col gap-0.5 !w-full">
                {collections.map((collection) => {
                  const href = `/collections/${collection.slug}` as Route;
                  return (
                    <li key={collection.id}>
                      <NavigationMenuLink
                        render={<Link href={href} />}
                        current={pathname === href}
                        className="flex flex-col gap-0.5 rounded-lg px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
                      >
                        <span className="truncate font-semibold text-on-surface">
                          {collection.name}
                        </span>
                        {collection.description && (
                          <span className="line-clamp-1 text-xs text-on-surface-variant">
                            {collection.description}
                          </span>
                        )}
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/contact" />}
            current={pathname === "/contact"}
            className={cn(
              "inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium transition-colors",
              pathname === "/contact"
                ? "bg-primary-fixed/60 font-semibold text-primary"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuViewport
        sideOffset={10}
        className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest shadow-xl"
      />
    </NavigationMenu>
  );
}
