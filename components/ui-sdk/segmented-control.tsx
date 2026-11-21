"use client";

import * as React from "react";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface FilterSegmentedControlProps<T extends string> {
  ariaLabel: string;
  options: Array<SegmentedOption<T>>;
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}

export function FilterSegmentedControl<T extends string>({
  ariaLabel,
  options,
  value,
  onValueChange,
  className,
}: FilterSegmentedControlProps<T>) {
  return (
    <div className={cn("max-w-full overflow-x-auto pb-1", className)}>
      <SegmentedControl
        aria-label={ariaLabel}
        value={value}
        onValueChange={(next) => {
          if (next) onValueChange(next as T);
        }}
        className="relative inline-flex min-w-max items-center gap-1 rounded-full border border-outline-variant/60 bg-surface-container p-1 shadow-xs"
      >
        <SegmentedControlIndicator className="z-0 rounded-full border-0 bg-primary shadow-sm" />
        {options.map((opt) => (
          <SegmentedControlItem
            key={opt.value}
            value={opt.value}
            className="relative z-10 h-9 rounded-full border-0 bg-transparent px-4 text-xs sm:text-sm font-semibold whitespace-nowrap text-on-surface-variant hover:text-on-surface data-[checked]:text-on-primary transition-colors cursor-pointer"
          >
            {opt.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  );
}
