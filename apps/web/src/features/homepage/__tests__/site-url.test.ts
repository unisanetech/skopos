import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "../../../lib/site";

describe("public site URL", () => {
  it("uses localhost only outside production", () => {
    expect(resolveSiteUrl({ NODE_ENV: "development" }).toString()).toBe(
      "http://localhost:4173/",
    );
  });

  it("requires an explicit HTTPS origin for production metadata", () => {
    expect(() => resolveSiteUrl({ NODE_ENV: "production" })).toThrow(
      "NEXT_PUBLIC_SITE_URL must be set",
    );
    expect(() =>
      resolveSiteUrl({ NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "http://example.com" }),
    ).toThrow("must use HTTPS");
    expect(
      resolveSiteUrl({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://skopos.example",
      }).origin,
    ).toBe("https://skopos.example");
  });

  it("rejects non-web protocols", () => {
    expect(() =>
      resolveSiteUrl({ NODE_ENV: "development", NEXT_PUBLIC_SITE_URL: "file:///tmp/site" }),
    ).toThrow("must use an HTTP or HTTPS origin");
    expect(() =>
      resolveSiteUrl({
        NODE_ENV: "development",
        NEXT_PUBLIC_SITE_URL: "https://example.com/products/skopos",
      }),
    ).toThrow("must be an origin");
  });
});
