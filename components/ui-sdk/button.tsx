"use client";

import * as React from "react";
import { Button as UiButton } from "@ui-sdk/react/button";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "tonal"
  | "outline"
  | "ghost"
  | "inverse"
  | "inverseOutline";

type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface AppButtonProps
  extends React.ComponentPropsWithoutRef<typeof UiButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-primary text-on-primary shadow-sm hover:bg-primary-container hover:text-on-primary-container",
  tonal:
    "border-transparent bg-secondary-container text-on-secondary-container hover:bg-primary-fixed hover:text-on-primary-fixed",
  outline:
    "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low",
  ghost:
    "border-transparent bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
  inverse:
    "border-transparent bg-tertiary-fixed text-on-tertiary-fixed shadow-md hover:bg-tertiary-fixed-dim",
  inverseOutline:
    "border-on-primary/25 bg-on-primary/10 text-on-primary backdrop-blur-sm hover:bg-on-primary/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs rounded-lg",
  md: "h-10 px-5 text-sm rounded-lg",
  lg: "h-12 px-7 text-sm rounded-xl",
  icon: "h-10 w-10 p-0 rounded-full",
};

export function AppButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: AppButtonProps) {
  return (
    <UiButton
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[pending]:opacity-70",
        variantClasses[variant],
        sizeClasses[size],
        typeof className === "string" ? className : undefined
      )}
    />
  );
}
