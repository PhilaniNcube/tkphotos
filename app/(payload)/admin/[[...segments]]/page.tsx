/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from "next";

import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap";

// Opt the catch-all admin page out of instant-navigation validation and
// prefetching. Setting `instant = false` on `app/(payload)/layout.tsx` only
// covers navigations into `(payload)` from outside; navigations between
// `/admin/...` subpages share that layout and still implicitly validate this
// page segment (including its URL-dependent `generateMetadata()`).
export const instant = false;
export const prefetch = "force-disabled";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({
  params,
  searchParams,
}: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap });

export default Page;
