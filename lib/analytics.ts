// Google Analytics utility functions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_location: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track contact form submissions
export const trackContactForm = () => {
  event({
    action: "submit",
    category: "Contact",
    label: "Contact Form Submission",
  });
};

// Track gallery views
export const trackGalleryView = (galleryName: string) => {
  event({
    action: "view",
    category: "Gallery",
    label: galleryName,
  });
};

// Track collection views
export const trackCollectionView = (collectionName: string) => {
  event({
    action: "view",
    category: "Collection",
    label: collectionName,
  });
};

// Track image downloads
export const trackImageDownload = (imageName: string) => {
  event({
    action: "download",
    category: "Image",
    label: imageName,
  });
};

// Track service inquiries
export const trackServiceInquiry = (serviceType: string) => {
  event({
    action: "inquiry",
    category: "Service",
    label: serviceType,
  });
};
