"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = () => {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/galleries", label: "Galleries" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <ul className="flex flex-col gap-2 p-4 md:p-0 md:flex-row md:items-center md:gap-6">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              className={
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground md:px-2 md:py-1 " +
                (active ? "text-primary" : "text-muted-foreground")
              }
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
