import * as React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { MEDIA_SIZE_WIDTHS, type MediaSizeName } from "@/lib/media";
import { getPostBySlug, type PostRow } from "@/lib/queries/posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatPublishedDate(raw: string): string {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "TK Media Journal";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function buildCoverSrcSet(post: PostRow): string | undefined {
  if (!post.cover_sizes) return undefined;
  const entries = (Object.keys(MEDIA_SIZE_WIDTHS) as MediaSizeName[])
    .map((name) => {
      const size = post.cover_sizes?.[name];
      return size?.url && size.width ? `${size.url} ${size.width}w` : null;
    })
    .filter(Boolean) as string[];
  return entries.length > 0 ? entries.join(", ") : undefined;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | TK Media",
      description: "The requested blog post was not found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    post.excerpt ||
    `Read ${post.title} on the TK Media blog — stories and insights from the Eastern Cape photography studio.`;

  return {
    title: `${post.title} | TK Media Blog`,
    description,
    keywords: ["TK Media blog", ...post.tags, post.title],
    openGraph: {
      title: `${post.title} | TK Media Blog`,
      description,
      type: "article",
      publishedTime: post.published_at,
      images: [
        {
          url: post.cover_sizes?.full?.url || post.cover_image || "/logo.webp",
          width:
            post.cover_sizes?.full?.width ?? post.cover_width ?? 799,
          height:
            post.cover_sizes?.full?.height ?? post.cover_height ?? 604,
          alt: post.cover_alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | TK Media`,
      description,
      images: [post.cover_sizes?.full?.url || post.cover_image || "/logo.webp"],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={<BlogPostFallback />}>
      <BlogPostContent params={params} />
    </Suspense>
  );
}

async function BlogPostContent({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverSrc =
    post.cover_sizes?.full?.url ||
    post.cover_sizes?.medium?.url ||
    post.cover_image;

  return (
    <article className="flex w-full flex-col pb-20">
      <header className="relative w-full overflow-hidden px-6 pb-10 pt-14 lg:px-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <Link
            href={"/blog" as Route}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to the blog</span>
          </Link>

          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary-container px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-on-secondary-container"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-on-surface sm:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mb-6 text-base leading-relaxed text-on-surface-variant sm:text-lg">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={post.published_at}>
                {formatPublishedDate(post.published_at)}
              </time>
            </span>
            {post.author && (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                {post.author}
              </span>
            )}
          </div>
        </div>
      </header>

      {coverSrc && (
        <div className="mx-auto mb-12 w-full max-w-5xl px-6 lg:px-12">
          <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-highest">
            <R2Image
              src={coverSrc}
              srcSet={buildCoverSrcSet(post)}
              sizes="(max-width: 1024px) 100vw, 960px"
              alt={post.cover_alt}
              loading="eager"
              fetchPriority="high"
              className="max-h-[32rem] w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-3xl px-6 lg:px-12">
        <RichText data={post.content} className="blog-content" />
      </div>
    </article>
  );
}

function BlogPostFallback() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 lg:px-12">
      <div className="mb-8 h-4 w-32 animate-pulse rounded bg-surface-container" />
      <div className="mb-4 h-10 w-4/5 animate-pulse rounded-lg bg-surface-container" />
      <div className="mb-10 h-4 w-1/2 animate-pulse rounded bg-surface-container" />
      <div className="mb-12 aspect-[16/9] animate-pulse rounded-2xl bg-surface-container" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-4 animate-pulse rounded bg-surface-container"
          />
        ))}
      </div>
    </div>
  );
}
