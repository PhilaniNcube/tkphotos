import * as React from "react";
import Link from "next/link";
import Image from "next/image";

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

        <div className="hidden md:block">{desktopNav}</div>

        {/* <UserMenu userData={userData} /> */}
      </div>
    </header>
  );
}
