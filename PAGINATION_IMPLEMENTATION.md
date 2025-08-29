# Pagination Implementation with nuqs

This project uses the `nuqs` package for URL state management, specifically for handling pagination in a type-safe and Next.js-friendly way.

## What was Fixed

The original galleries pagination was broken because it used an incorrect `href` format that doesn't work with Next.js routing:

```tsx
// ❌ Broken - incorrect href format
<PaginationLink
  href={{ pathname: "/galleries", query: { page: p } } as any}
  isActive={p === page}
>
  {p}
</PaginationLink>
```

## New Implementation

### 1. **GalleryPagination Component**
- Location: `app/(public)/galleries/_components/gallery-pagination.tsx`
- Uses `usePagination` hook for state management
- Handles click events properly instead of navigation
- Fully client-side with proper URL updates

### 2. **GalleriesProvider Component**
- Location: `app/(public)/galleries/_components/galleries-provider.tsx`
- Wraps the galleries page with `NuqsAdapter`
- Required for nuqs to work properly in the app

### 3. **usePagination Hook**
- Location: `hooks/use-pagination.ts`
- Reusable hook for pagination logic
- Provides methods: `goToPage`, `goToNextPage`, `goToPreviousPage`, `resetToFirstPage`
- Can be used in other components that need pagination

## Key Features

✅ **URL Synchronization**: Page state is synced with the URL  
✅ **Browser Navigation**: Back/forward buttons work correctly  
✅ **Type Safety**: Full TypeScript support  
✅ **Server Rendering**: Compatible with Next.js SSR  
✅ **Reusable**: Pagination logic can be used in other components  

## Usage Example

```tsx
// In a component that needs pagination
import { usePagination } from '@/hooks/use-pagination';

function MyComponent() {
  const { page, goToPage, goToNextPage, goToPreviousPage } = usePagination(1);
  
  return (
    <div>
      <button onClick={() => goToPreviousPage(page)}>Previous</button>
      <span>Page {page}</span>
      <button onClick={() => goToNextPage(page, totalPages)}>Next</button>
    </div>
  );
}
```

## Benefits of nuqs

1. **URL State Management**: Automatically handles URL query parameters
2. **Type Safety**: Built-in parsers for different data types
3. **Server-Side Compatibility**: Works with Next.js server components
4. **Browser History**: Proper integration with browser navigation
5. **Performance**: Optimized for React and Next.js

## Migration Guide

If you have other components using similar broken pagination patterns:

1. Wrap the page/section with `NuqsAdapter` or create a provider component
2. Replace `href` props with `onClick` handlers
3. Use the `usePagination` hook for state management
4. Update click handlers to use the hook methods

This ensures consistent, working pagination across the entire application.
