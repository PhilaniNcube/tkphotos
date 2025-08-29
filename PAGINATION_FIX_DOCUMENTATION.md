# Pagination Data Fetching Fix

## Problem
The pagination on the galleries page was not fetching new data when clicking pagination links. The URL was updating correctly, but the page content remained the same.

## Root Cause
The original implementation had a server component that read `searchParams` but didn't re-render when URL query parameters changed client-side. Server components only re-render on page navigation, not on query parameter changes triggered by client-side JavaScript.

## Solution
Implemented a hybrid approach with both server-side and client-side data fetching:

### 1. **Server Component (galleries/page.tsx)**
- Fetches initial data on page load
- Provides initial state to client component
- Still server-rendered for SEO and initial performance

### 2. **Client Component (galleries-client.tsx)**
- Handles pagination state with `nuqs`
- Fetches new data when page changes
- Shows loading state during fetch
- Smoothly updates the UI

### 3. **Client-Safe Query Function (galleries-client.ts)**
- Created a browser-client version of the galleries query
- Avoids server-only dependencies like `next/headers`
- Uses the same logic but with browser client

## Key Features

✅ **Server-Side Initial Load**: Fast initial render with SEO benefits  
✅ **Client-Side Navigation**: Instant pagination without full page reloads  
✅ **Loading States**: User feedback during data fetching  
✅ **URL Synchronization**: Browser history and bookmarkable URLs  
✅ **Error Handling**: Graceful fallbacks on fetch errors  

## Technical Implementation

### Before (Broken)
```tsx
// Server component that doesn't re-render on client navigation
export default async function Page({ searchParams }) {
  const data = await getGalleriesPaginated({ page });
  return (
    <div>
      <GalleryGrid data={data} />
      <PaginationLinks /> {/* Updates URL but doesn't trigger re-render */}
    </div>
  );
}
```

### After (Working)
```tsx
// Server component provides initial data
export default async function Page({ searchParams }) {
  const initialData = await getGalleriesPaginated({ page });
  return (
    <GalleriesProvider>
      <GalleriesClient 
        initialData={initialData}
        initialPage={page}
        // ... other props
      />
    </GalleriesProvider>
  );
}

// Client component handles pagination
function GalleriesClient({ initialData, initialPage }) {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [galleries, setGalleries] = useState(initialData);
  
  useEffect(() => {
    if (page !== initialPage) {
      fetchNewData(page); // Client-side fetch
    }
  }, [page]);
  
  return (
    <div>
      <GalleryGrid data={galleries} />
      <Pagination currentPage={page} /> {/* Updates URL and triggers useEffect */}
    </div>
  );
}
```

## Benefits

1. **Best of Both Worlds**: Server-side initial load + client-side navigation
2. **Performance**: No full page reloads for pagination
3. **SEO Friendly**: Initial content is server-rendered
4. **User Experience**: Instant feedback and smooth transitions
5. **Maintainable**: Clear separation of server/client concerns

## Files Modified

- `app/(public)/galleries/page.tsx` - Server component with initial data
- `app/(public)/galleries/_components/galleries-client.tsx` - Client pagination logic
- `lib/queries/galleries-client.ts` - Browser-safe query function
- `lib/client.ts` - Added Database type import

This architecture can be reused for other paginated components throughout the application.
