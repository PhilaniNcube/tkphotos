"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const NavLinks = () => {
  const pathname = usePathname();
  const [galleryLinks, setGalleryLinks] = useState<
    { slug: string; title: string }[]
  >([]);
  const [collectionLinks, setCollectionLinks] = useState<
    { slug: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        // Fetch galleries & collections in parallel
        const [gals, cols] = await Promise.all([
          supabase
            .from("galleries")
            .select("slug,title,is_public,created_at")
            .eq("is_public", true)
            .order("created_at", { ascending: false })
            .limit(15),
          supabase
            .from("collections")
            .select("slug,name,created_at")
            .order("created_at", { ascending: false })
            .limit(15),
        ]);
        if (gals.error) throw gals.error;
        if (cols.error) throw cols.error;
        if (!cancelled) {
          setGalleryLinks(
            (gals.data || []).map((g) => ({ slug: g.slug, title: g.title }))
          );
          setCollectionLinks(
            (cols.data || []).map((c) => ({ slug: c.slug, name: c.name }))
          );
        }
      } catch (e: any) {
        if (!cancelled)
          setError(e.message || "Failed to load galleries & collections");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const staticLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];
  const isActive = (href: string) => pathname === href;
  const isGalleriesActive = pathname.startsWith("/galleries");
  const isCollectionsActive = pathname.startsWith("/collections");

  return (
    <NavigationMenu viewport={false} className="w-full md:w-auto">
      <NavigationMenuList className="flex flex-col gap-2 p-4 md:p-0 md:flex-row md:items-center md:gap-2">
        {staticLinks.map((l) => (
          <NavigationMenuItem key={l.href}>
            <NavigationMenuLink asChild data-active={isActive(l.href)}>
              <Link
                href={l.href}
                className={
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors bg-transparent hover:bg-accent hover:text-accent-foreground md:px-3 md:py-2 " +
                  (isActive(l.href) ? "text-primary" : "text-muted-foreground")
                }
              >
                {l.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        {/* Galleries submenu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={
              isGalleriesActive ? "text-primary bg-accent/50" : undefined
            }
          >
            Galleries
          </NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[250px] md:min-w-[340px]">
            <div className="grid gap-1 p-2 md:w-[340px]">
              {loading && (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  Loading…
                </div>
              )}
              {error && !loading && (
                <div className="text-xs text-red-600 px-2 py-1">
                  Failed to load
                </div>
              )}
              {galleryLinks.length === 0 && !loading && !error && (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  No public galleries yet
                </div>
              )}
              {galleryLinks.map((g) => {
                const href = `/galleries/${g.slug}`;
                const active = pathname === href;
                return (
                  <NavigationMenuLink
                    key={g.slug}
                    asChild
                    data-active={active}
                    className="data-[active=true]:bg-accent/60"
                  >
                    <Link
                      href={href}
                      className={
                        "rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground " +
                        (active ? "text-primary" : "text-muted-foreground")
                      }
                    >
                      {g.title}
                    </Link>
                  </NavigationMenuLink>
                );
              })}
              <div className="pt-1 px-2">
                <Link
                  href="/galleries"
                  className="text-xs underline text-muted-foreground hover:text-primary"
                >
                  View all galleries →
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* Collections submenu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={
              isCollectionsActive ? "text-primary bg-accent/50" : undefined
            }
          >
            Collections
          </NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[250px] md:min-w-[340px]">
            <div className="grid gap-1 p-2 md:w-[340px]">
              {loading && (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  Loading…
                </div>
              )}
              {error && !loading && (
                <div className="text-xs text-red-600 px-2 py-1">
                  Failed to load
                </div>
              )}
              {collectionLinks.length === 0 && !loading && !error && (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  No collections yet
                </div>
              )}
              {collectionLinks.map((c) => {
                const href = `/collections/${c.slug}`;
                const active = pathname === href;
                return (
                  <NavigationMenuLink
                    key={c.slug}
                    asChild
                    data-active={active}
                    className="data-[active=true]:bg-accent/60"
                  >
                    <Link
                      href={href}
                      className={
                        "rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground " +
                        (active ? "text-primary" : "text-muted-foreground")
                      }
                    >
                      {c.name}
                    </Link>
                  </NavigationMenuLink>
                );
              })}
              <div className="pt-1 px-2">
                <Link
                  href="/collections"
                  className="text-xs underline text-muted-foreground hover:text-primary"
                >
                  View all collections →
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;
