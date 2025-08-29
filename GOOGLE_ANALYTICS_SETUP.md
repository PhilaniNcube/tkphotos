# Google Analytics Setup

This project uses Google Analytics 4 (GA4) for website analytics through the `@next/third-parties` package.

## Setup Instructions

### 1. Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new account or use an existing one
3. Create a new property for your website
4. Set up a GA4 data stream for your website
5. Copy the Measurement ID (format: G-XXXXXXXXXX)

### 2. Environment Variables

Add your Google Analytics Measurement ID to your environment variables:

1. Copy `.env.example` to `.env.local`
2. Add your Measurement ID:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### 3. Features Included

- **Automatic Page View Tracking**: All page navigation is automatically tracked
- **Custom Event Tracking**: Helper functions for tracking user interactions
- **Privacy Compliant**: Only loads when the environment variable is set

## Usage

### Custom Event Tracking

Import the analytics functions to track custom events:

```typescript
import { 
  trackContactForm, 
  trackGalleryView, 
  trackCollectionView,
  trackImageDownload,
  trackServiceInquiry 
} from '@/lib/analytics';

// Track contact form submissions
const handleSubmit = () => {
  trackContactForm();
  // ... rest of form logic
};

// Track gallery views
const handleGalleryView = (galleryName: string) => {
  trackGalleryView(galleryName);
};

// Track service inquiries
const handleServiceInquiry = (serviceType: string) => {
  trackServiceInquiry(serviceType);
};
```

### Custom Events

For more specific tracking, use the generic event function:

```typescript
import { event } from '@/lib/analytics';

event({
  action: 'click',
  category: 'Button',
  label: 'Header CTA',
  value: 1
});
```

## Development vs Production

- In development, Google Analytics will only load if you have the environment variable set
- The tracking functions will safely do nothing if Google Analytics isn't loaded
- Always test your analytics setup in production to ensure data is being collected

## Privacy Considerations

- Google Analytics is only loaded when the environment variable is present
- Consider adding a cookie consent banner if required by your jurisdiction
- Review Google's privacy policies and ensure compliance with GDPR/CCPA if applicable

## Verification

After deployment:

1. Visit your website
2. Check Google Analytics Real-time reports
3. Navigate between pages to verify page view tracking
4. Test custom events to ensure they appear in the Events section
