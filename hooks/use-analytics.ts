import { useEffect } from "react";
import { pageview } from "@/lib/analytics";

export const useAnalytics = (url: string) => {
  useEffect(() => {
    if (url) {
      pageview(url);
    }
  }, [url]);
};
