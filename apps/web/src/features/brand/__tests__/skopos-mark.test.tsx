import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  createSkoposLogoMarkSvg,
  createSkoposLogoMaskableSvg,
  SKOPOS_BRAND_COLORS,
  SKOPOS_MARK_PATHS,
} from "../skopos-brand";
import { SkoposMark } from "../skopos-mark";

describe("SkoposMark", () => {
  it("renders the two sharp opposing arrows as one decorative brand mark", () => {
    const markup = renderToStaticMarkup(createElement(SkoposMark, { className: "test-mark" }));

    expect(markup).toContain('class="test-mark"');
    expect(markup).toContain('class="skopos-mark-primary"');
    expect(markup).toContain('class="skopos-mark-ink"');
    expect(markup).toContain(`d="${SKOPOS_MARK_PATHS.signal}"`);
    expect(markup).toContain(`d="${SKOPOS_MARK_PATHS.ink}"`);
    expect(markup).toContain(`fill="${SKOPOS_BRAND_COLORS.signal}"`);
    expect(markup).toContain(`fill="${SKOPOS_BRAND_COLORS.ink}"`);
    expect(markup).not.toContain("stroke");
    expect(markup).not.toContain("rx=");
    expect(markup).toContain('aria-hidden="true"');
    expect(markup.match(/<path/g)).toHaveLength(2);
  });

  it("exports transparent and maskable assets from the same geometry", () => {
    const logo = createSkoposLogoMarkSvg();
    const maskable = createSkoposLogoMaskableSvg();

    expect(logo).toContain(SKOPOS_MARK_PATHS.signal);
    expect(logo).toContain(SKOPOS_MARK_PATHS.ink);
    expect(logo).not.toContain("<rect");
    expect(maskable).toContain(SKOPOS_MARK_PATHS.signal);
    expect(maskable).toContain(SKOPOS_MARK_PATHS.ink);
    expect(maskable).toContain(`fill="${SKOPOS_BRAND_COLORS.canvas}"`);
  });

  it("keeps the generated brand asset family in sync with the canonical source", () => {
    expect(readFileSync(resolve("public/brand/logo-mark.svg"), "utf8")).toBe(
      createSkoposLogoMarkSvg(),
    );
    expect(readFileSync(resolve("public/brand/logo-mark-maskable.svg"), "utf8")).toBe(
      createSkoposLogoMaskableSvg(),
    );

    for (const asset of [
      "public/brand/logo-mark-2048.png",
      "public/brand/icons/favicon-32.png",
      "public/brand/icons/apple-touch-icon.png",
      "public/brand/icons/pwa-192.png",
      "public/brand/icons/pwa-512.png",
      "public/brand/icons/pwa-512-maskable.png",
      "src/app/favicon.ico",
    ]) {
      expect(statSync(resolve(asset)).size).toBeGreaterThan(0);
    }
  });
});
