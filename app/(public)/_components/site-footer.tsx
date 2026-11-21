import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { CurrentYear } from "./current-year";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-outline-variant/50 bg-surface-container-low py-10 pb-24 md:pb-10 text-sm text-on-surface-variant">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 lg:px-12 md:flex-row">
        <p className="text-center md:text-left">
          &copy;{" "}
          <Suspense fallback={null}>
            <CurrentYear />
          </Suspense>{" "}
          TK Media / TK Photography. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <a
              href="https://www.tiktok.com/@thandikayamatokazizizi?_t=ZM-8zGISpU5Osw&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Follow TK Media on TikTok"
            >
              <FaTiktok className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/tkphotography_and_videography?igsh=aWp3bjd5NzA0cjF1&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Follow TK Media on Instagram"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://www.facebook.com/share/1DchY5rHjk/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Follow TK Media on Facebook"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-on-surface transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-on-surface transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
