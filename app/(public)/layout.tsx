import React from "react";
import Link from "next/link";
import NavLinks from "./_components/nav-links";
import MobileMenu from "./_components/mobile-menu";
import { getCurrentUser } from "@/lib/queries/user";
import UserButton from "./_components/user-button";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const userData = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Link
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </Link>
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex gap-x-2 items-center">
              <MobileMenu />
              TK Photos
            </div>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:block">
            <NavLinks />
          </nav>
          {/* Mobile menu button */}

          {/* User info if logged in */}
          <UserButton userData={userData} />
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="border-t bg-background/60 py-8 text-sm">
      <div className="container mx-auto px-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} TK Photos. All rights reserved.
        </p>
        <div className="flex gap-4 text-muted-foreground">
          <Link href="/privacy" className="hover:text-primary">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default PublicLayout;
