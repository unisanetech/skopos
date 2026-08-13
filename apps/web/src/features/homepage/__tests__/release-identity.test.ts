import { describe, expect, it } from "vitest";
import {
  canonicalWebIdentity,
  releaseIdentityPath,
  resolveWebReleaseIdentity,
} from "../../../lib/release-identity";

describe("public web release identity", () => {
  it("publishes the canonical product and repository identity", () => {
    expect(releaseIdentityPath).toBe("/.well-known/skopos-release");
    expect(canonicalWebIdentity).toEqual({
      schemaVersion: 1,
      kind: "skopos.web-build-identity",
      product: "Skopos",
      repository: "github.com/unisanetech/skopos",
    });
  });

  it("requires the exact deployed commit in production", () => {
    expect(() => resolveWebReleaseIdentity({ NODE_ENV: "production" })).toThrow(
      "SKOPOS_WEB_CANDIDATE_SHA must identify the deployed source commit",
    );
    expect(() =>
      resolveWebReleaseIdentity({
        NODE_ENV: "production",
        SKOPOS_WEB_CANDIDATE_SHA: "not-a-git-sha",
      }),
    ).toThrow("must be a full lowercase Git commit SHA");

    expect(
      resolveWebReleaseIdentity({
        NODE_ENV: "production",
        SKOPOS_WEB_CANDIDATE_SHA: "a".repeat(40),
      }),
    ).toEqual({
      ...canonicalWebIdentity,
      candidateCommit: "a".repeat(40),
      environment: "production",
    });
  });

  it("uses an explicit non-certifying identity during local development", () => {
    expect(resolveWebReleaseIdentity({ NODE_ENV: "development" })).toEqual({
      ...canonicalWebIdentity,
      candidateCommit: null,
      environment: "development",
    });
  });
});
