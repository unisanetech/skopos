import { describe, expect, it } from "vitest";
import { publicLinks } from "../content/public-links";

describe("homepage public destinations", () => {
  it("uses real target destinations instead of placeholder page anchors", () => {
    expect(publicLinks.npm).toBe("https://www.npmjs.com/package/@skopos/cli");
    expect(publicLinks.source).toBe("https://github.com/Croodo/skopos");
    expect(publicLinks.productModel).toBe(
      "https://github.com/Croodo/skopos/blob/main/docs/overview.md",
    );
    expect(publicLinks.releaseProgress).toBe("https://github.com/Croodo/skopos/releases");
    expect(Object.values(publicLinks).every((value) => value.startsWith("https://"))).toBe(true);
  });
});
