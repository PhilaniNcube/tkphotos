# Favicon Implementation

This project includes a comprehensive favicon setup generated from the main logo for optimal display across all devices and platforms.

## Generated Files

The following favicon files have been automatically generated from `/public/logo.webp`:

### Standard Favicons
- `favicon.ico` - Main favicon (32x32)
- `favicon-16x16.png` - Small favicon
- `favicon-32x32.png` - Standard favicon

### Apple Touch Icons
- `apple-touch-icon.png` - 180x180 (default Apple icon)
- `apple-touch-icon-120x120.png` - iPhone standard
- `apple-touch-icon-152x152.png` - iPad standard

### Android Chrome Icons
- `android-chrome-192x192.png` - Android home screen
- `android-chrome-512x512.png` - Android splash screen

### Progressive Web App Icons
- `icon-72x72.png` - PWA small
- `icon-96x96.png` - PWA medium
- `icon-144x144.png` - PWA large

## Browser Support

The favicon implementation provides optimal support for:

- ✅ Chrome/Chromium browsers
- ✅ Safari (iOS and macOS)
- ✅ Firefox
- ✅ Edge
- ✅ Internet Explorer 11+
- ✅ Android browsers
- ✅ Progressive Web Apps

## File Locations

All favicon files are located in `/public/` directory and are automatically served by Next.js at the root level.

## Regenerating Favicons

If you update the logo, you can regenerate all favicons by running:

```bash
pnpm run generate-favicons
```

This will:
1. Read the current `/public/logo.webp`
2. Generate all favicon sizes using Sharp
3. Overwrite existing favicon files

## Implementation Details

### HTML Meta Tags
The favicons are configured in `/app/layout.tsx` with comprehensive meta tags:

```typescript
icons: {
  icon: [
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon.ico", sizes: "any" },
  ],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180" },
    { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
    { url: "/apple-touch-icon-120x120.png", sizes: "120x120" },
  ],
  // ... more configurations
}
```

### Web App Manifest
PWA icons are configured in `/app/manifest.ts` for proper app installation and home screen display.

## Technical Notes

- **Format**: All favicons are generated as PNG files for better transparency support
- **Quality**: Sharp library ensures optimal compression and quality
- **Consistency**: All icons maintain the same visual appearance at different sizes
- **Standards**: Follows current web standards for favicon implementation

## Troubleshooting

### Favicon Not Updating
If favicon changes aren't visible:
1. Clear browser cache (Ctrl/Cmd + Shift + R)
2. Check browser dev tools Network tab
3. Verify files exist in `/public/` directory

### PWA Installation Issues
If PWA installation isn't working:
1. Check manifest.json is accessible
2. Verify all required icon sizes are present
3. Ensure HTTPS is enabled in production

## File Sizes

Generated files are optimized for web delivery:
- favicon.ico: ~1-2KB
- PNG icons: ~1-5KB each
- Total size: ~15-25KB for all icons

This implementation provides comprehensive favicon coverage while maintaining optimal performance.
