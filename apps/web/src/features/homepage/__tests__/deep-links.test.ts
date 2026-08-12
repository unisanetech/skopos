import { describe, expect, it } from "vitest";
import { homepageDeepLinks, promiseCopy } from "../content/homepage-copy";

describe("homepage deep links", () => {
  it("connects the primary product claims to their dedicated routes", () => {
    expect(homepageDeepLinks).toEqual({
      workflow: "/how-it-works",
      projectMemory: "/project-memory",
    });
  });

  it("gives every promise a relevant deeper explanation", () => {
    expect(promiseCopy.map((promise) => promise.linkHref)).toEqual([
      "/project-memory",
      "/how-it-works#bound",
      "/how-it-works#prove",
    ]);
  });
});
