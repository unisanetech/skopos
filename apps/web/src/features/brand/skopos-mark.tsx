import * as React from "react";
import { SKOPOS_BRAND_COLORS, SKOPOS_MARK_PATHS } from "./skopos-brand";

type SkoposMarkProps = {
  className?: string;
};

export function SkoposMark({ className }: SkoposMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="skopos-mark-primary"
        d={SKOPOS_MARK_PATHS.signal}
        fill={SKOPOS_BRAND_COLORS.signal}
      />
      <path
        className="skopos-mark-ink"
        d={SKOPOS_MARK_PATHS.ink}
        fill={SKOPOS_BRAND_COLORS.ink}
      />
    </svg>
  );
}
