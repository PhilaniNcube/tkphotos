import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { MEDIA_SIZE_WIDTHS, type MediaSizeName } from "@/lib/media";
import type { PostRow } from "@/lib/queries/posts";

function formatDateLabel(raw: string): string {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "Journal";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .toUpperCase();
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

interface BlogListSectionProps {
  posts: PostRow[];
}

export function BlogListSection({ posts }: BlogListSectionProps) {
  if (posts.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-12">
        <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-on-surface">No posts yet</h2>
          <p className="mt-1 max-w-sm text-sm text-on-surface-variant">
            Stories from recent shoots, behind-the-scenes notes and photography
            tips will appear here soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-12 lg:px-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const href = `/blog/${post.slug}` as Route;
          const coverSrc =
            post.cover_sizes?.medium?.url ||
            post.cover_sizes?.thumbnail?.url ||
            post.cover_image;

          return (
            <article key={post.id} className="flex">
              <Link
                href={href}
                className="group flex w-full flex-col overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-low shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container-highest">
                  <R2Image
                    src={coverSrc}
                    srcSet={buildCoverSrcSet(post)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    alt={post.cover_alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 font-mono text-[11px] font-semibold text-on-surface backdrop-blur-md">
                    {formatDateLabel(post.published_at)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  {post.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary-container px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-on-secondary-container"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="mb-1.5 line-clamp-2 text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>

                  <p className="mb-4 line-clamp-3 flex-1 text-sm text-on-surface-variant">
                    {post.excerpt ||
                      "Read the latest story from the TK Media journal."}
                  </p>

                  <div className="flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      Read Article
                    </span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
