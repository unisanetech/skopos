export const SKOPOS_BRAND_COLORS = {
  signal: "#2864ff",
  ink: "#0b1424",
  canvas: "#f8f7f3",
} as const;

export const SKOPOS_MARK_VIEW_BOX = "0 0 64 64";

export const SKOPOS_MARK_PATHS = {
  signal: "M48 4L17.3 29.21L16 28.15V36.15H26.54L23.12 33.28L48 12.83Z",
  ink: "M47.91 28.53H37.55L40.79 31.17L16 51.32V60L46.24 35.32L48 36.6Z",
} as const;

export function createSkoposLogoMarkSvg() {
  return `<svg width="64" height="64" viewBox="${SKOPOS_MARK_VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${SKOPOS_MARK_PATHS.signal}" fill="${SKOPOS_BRAND_COLORS.signal}" />
  <path d="${SKOPOS_MARK_PATHS.ink}" fill="${SKOPOS_BRAND_COLORS.ink}" />
</svg>
`;
}

export function createSkoposLogoMaskableSvg() {
  return `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${SKOPOS_BRAND_COLORS.canvas}" />
  <g transform="translate(64 64) scale(6)">
    <path d="${SKOPOS_MARK_PATHS.signal}" fill="${SKOPOS_BRAND_COLORS.signal}" />
    <path d="${SKOPOS_MARK_PATHS.ink}" fill="${SKOPOS_BRAND_COLORS.ink}" />
  </g>
</svg>
`;
}
