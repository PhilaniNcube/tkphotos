# Sitemap Implementation

This project includes a comprehensive sitemap implementation for better SEO and search engine discoverability.

## Files Created

### 1. Dynamic Sitemap (`/app/sitemap.ts`)
- **URL**: `/sitemap.xml`
- Automatically generates sitemap from database content
- Includes all static pages and dynamic routes (collections, galleries)
- Updates automatically when new content is added
- Prioritizes pages by importance
- Uses proper change frequencies for different page types

### 2. Robots.txt (`/app/robots.ts`)
- **URL**: `/robots.txt`
- Tells search engines which pages to crawl
- Blocks sensitive areas (dashboard, API routes, auth flows)
- References the sitemap location

### 3. Web App Manifest (`/app/manifest.ts`)
- **URL**: `/manifest.json`
- Provides PWA metadata
- Enables "Add to Home Screen" functionality
- Improves mobile experience

### 4. Static Sitemap Backup (`/public/sitemap.xml`)
- Fallback XML sitemap with static routes
- Can be used if dynamic generation fails

## Environment Configuration

Add to your `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## How It Works

### Dynamic Content
The sitemap automatically fetches:
- All collections from `getAllCollections()`
- All public galleries from `getGalleriesPaginated()`

### URL Structure
- Static pages: `/`, `/about`, `/contact`, `/services`, etc.
- Collections: `/collections/[slug]`
- Galleries: `/galleries/[slug]`
- Auth pages: `/auth/login`, `/auth/sign-up`
- Legal pages: `/privacy`, `/terms`

### Priority Levels
- Homepage: 1.0 (highest)
- Main sections (collections, galleries): 0.9
- About, contact, services: 0.8
- Individual collections/galleries: 0.7
- Auth/legal pages: 0.3 (lowest)

### Change Frequencies
- Homepage: weekly
- Content sections: weekly
- About/contact/services: monthly
- Legal/auth pages: yearly

## SEO Benefits

1. **Better Indexing**: Search engines can discover all pages
2. **Faster Crawling**: Tells bots about new content quickly
3. **Priority Signals**: Helps search engines understand page importance
4. **Mobile Optimization**: PWA manifest improves mobile experience
5. **Content Freshness**: Dynamic updates show content recency

## Accessing the Sitemap

- **XML Sitemap**: `https://your-domain.com/sitemap.xml`
- **Robots.txt**: `https://your-domain.com/robots.txt`
- **Manifest**: `https://your-domain.com/manifest.json`

## Search Console Setup

Submit your sitemap to search engines:
- **Google**: Google Search Console → Sitemaps → Add sitemap URL
- **Bing**: Bing Webmaster Tools → Sitemaps → Submit sitemap

## Monitoring

Check sitemap status regularly:
1. Visit `/sitemap.xml` to ensure it loads
2. Monitor Google Search Console for indexing issues
3. Check robots.txt is properly blocking sensitive areas
4. Verify new collections/galleries appear in sitemap automatically
