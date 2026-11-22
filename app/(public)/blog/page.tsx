import * as React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getPostsPaginated } from "@/lib/queries/posts";
import { BlogListSection } from "./_components/blog-list-section";
import { BlogPagination } from "./_components/blog-pagination";

export const metadata: Metadata = {
  title: "Blog | TK Media",
  description:
    "Stories from recent shoots, behind-the-scenes notes and photography tips from TK Media, the Eastern Cape photography and media studio.",
  keywords: [
    "TK Media blog",
    "photography blog",
    "Eastern Cape photographer",
    "behind the scenes",
    "photography tips",
    "visual storytelling",
  ],
  openGraph: {
    title: "Blog | TK Media",
    description:
      "Stories from recent shoots, behind-the-scenes notes and photography tips from TK Media.",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 799,
        height: 604,
        alt: "TK Media Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | TK Media",
    description:
      "Stories from recent shoots, behind-the-scenes notes and photography tips from TK Media.",
    images: ["/logo.webp"],
  },
  alternates: {
    canonical: "/blog",
  },
};

interface BlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <Suspense fallback={<BlogPageFallback />}>
      <BlogPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function BlogPageContent({ searchParams }: BlogPageProps) {
  const resolved = await searchParams;
  const pageParam = Array.isArray(resolved.page)
    ? resolved.page[0]
    : resolved.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const result = await getPostsPaginated({ page, pageSize: 9 });

  return (
    <div className="flex w-full flex-col">
      <section className="relative w-full overflow-hidden px-6 pb-12 pt-14 lg:px-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary-container px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-on-secondary-container">
            <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>TK Media Journal</span>
          </div>

          <h1 className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
            Stories &amp; Insights
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Notes from recent shoots, the stories behind the frames, and
            practical photography advice from across the Eastern Cape.
          </p>
        </div>
      </section>

      {result.error ? (
        <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-12">
          <p className="text-sm text-error">Failed to load blog posts.</p>
        </div>
      ) : (
        <>
          <BlogListSection posts={result.data} />
          <BlogPagination page={result.page} pageCount={result.pageCount} />
        </>
      )}
    </div>
  );
}

function BlogPageFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-12">
      <div className="mb-8 space-y-3">
        <div className="mx-auto h-9 w-64 animate-pulse rounded-lg bg-surface-container" />
        <div className="mx-auto h-4 w-96 max-w-full animate-pulse rounded bg-surface-container" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[16/10] animate-pulse rounded-2xl bg-surface-container"
          />
        ))}
      </div>
    </div>
  );
}
