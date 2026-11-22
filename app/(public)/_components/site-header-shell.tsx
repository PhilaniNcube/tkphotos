import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";

interface SiteHeaderShellProps {
  mobileNav: React.ReactNode;
  desktopNav: React.ReactNode;
}

export function SiteHeaderShell({
  mobileNav,
  desktopNav,
}: SiteHeaderShellProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-outline-variant/60 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-2.5 shrink-0">
          {mobileNav}
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

        <div className="flex items-center gap-3">
          <div className="hidden md:block">{desktopNav}</div>
          <AppButton
            variant="primary"
            size="sm"
            className="hidden h-9 gap-2 rounded-full pl-4 pr-1.5 lg:inline-flex"
            render={<Link href="/contact" />}
          >
            <span>Book a Shoot</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </AppButton>
        </div>
      </div>
    </header>
  );
}
