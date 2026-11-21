"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer";
import {
  Camera,
  Home,
  Images,
  Layers,
  Mail,
  Menu,
  UserCheck,
  X,
} from "lucide-react";
import type { CollectionRow } from "@/lib/media";
import { cn } from "@/lib/utils";

interface MobileNavDrawerProps {
  collections: CollectionRow[];
  isSignedIn: boolean;
}

const primaryNavItems: Array<{
  href: Route;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: UserCheck },
  { href: "/services", label: "Services", icon: Camera },
  { href: "/galleries", label: "Galleries", icon: Images },
  { href: "/collections", label: "Collections", icon: Layers },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function MobileNavDrawer({
  collections,
  isSignedIn,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer side="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        aria-label="Open navigation menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent text-on-surface hover:bg-surface-container-high md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </DrawerTrigger>
      <DrawerBackdrop className="bg-on-surface/40 backdrop-blur-xs" />
      <DrawerContent className="w-[min(20rem,86vw)] border-r border-outline-variant bg-surface p-0 gap-0">
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-5 py-4">
          <div>
            <DrawerTitle className="text-base font-bold text-primary">
              TK Photography
            </DrawerTitle>
            <DrawerDescription className="mt-0.5 text-xs text-on-surface-variant">
              Eastern Cape &amp; South Africa
            </DrawerDescription>
          </div>
          <DrawerClose
            aria-label="Close navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </DrawerClose>
        </div>

        <nav
          aria-label="Mobile menu navigation"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-6"
        >
          <ul className="space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-secondary-container font-semibold text-on-secondary-container"
                        : "text-on-surface hover:bg-surface-container"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {collections.length > 0 && (
            <div className="space-y-2 border-t border-outline-variant/60 pt-4">
              <p className="px-3.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                Collections
              </p>
              <div className="flex flex-wrap gap-1.5 px-3">
                {collections.slice(0, 6).map((col) => {
                  const href = `/collections/${col.slug}` as Route;
                  return (
                    <Link
                      key={col.id}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                    >
                      {col.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-outline-variant/60 pt-4 px-2 space-y-2">
            {isSignedIn ? (
              <Link
                href="/protected"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-container"
              >
                Client Portal
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-semibold text-on-surface"
                >
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-on-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
