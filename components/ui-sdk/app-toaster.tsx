"use client";

import * as React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "@ui-sdk/react/toast";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";

export function AppToaster() {
  return (
    <ToastRegion
      aria-label="Notifications"
      side="bottom"
      align="end"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-[min(22rem,calc(100vw-2rem))]"
    >
      {(item) => (
        <Toast className="flex w-full items-start gap-3 rounded-xl border border-outline-variant/40 bg-inverse-surface p-4 text-inverse-on-surface shadow-xl">
          <span className="mt-0.5 shrink-0 text-tertiary-fixed" aria-hidden="true">
            {item.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-error-container" />
            ) : item.type === "info" ? (
              <Info className="h-4 w-4 text-primary-fixed" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-tertiary-fixed" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <ToastTitle className="text-sm font-semibold leading-snug text-inverse-on-surface" />
            <ToastDescription className="mt-1 text-xs leading-relaxed text-inverse-on-surface/80" />
          </div>
          <ToastClose
            aria-label="Dismiss notification"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-inverse-on-surface/75 hover:bg-white/10 hover:text-inverse-on-surface transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </ToastClose>
        </Toast>
      )}
    </ToastRegion>
  );
}
