"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Camera, Home, Images, Layers, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileTabs: Array<{
  href: Route;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { href: "/", label: "Home", icon: Home },
  { href: "/galleries", label: "Galleries", icon: Images },
  { href: "/collections", label: "Collections", icon: Layers },
  { href: "/services", label: "Services", icon: Camera },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-outline-variant/60 bg-surface/95 backdrop-blur-xl md:hidden"
    >
      <div className="flex h-16 items-center justify-around px-1">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-w-[3.5rem] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-11 items-center justify-center rounded-full transition-colors",
                  isActive ? "bg-secondary-container text-primary" : ""
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
