export const releaseIdentityPath = "/.well-known/skopos-release";

export const canonicalWebIdentity = {
  schemaVersion: 1,
  kind: "skopos.web-build-identity",
  product: "Skopos",
  repository: "github.com/unisanetech/skopos",
} as const;

type ReleaseIdentityEnvironment = {
  NODE_ENV?: string;
  SKOPOS_WEB_CANDIDATE_SHA?: string;
};

export function resolveWebReleaseIdentity(environment: ReleaseIdentityEnvironment) {
  const candidateCommit = environment.SKOPOS_WEB_CANDIDATE_SHA?.trim() || null;

  if (candidateCommit && !/^[a-f0-9]{40}$/u.test(candidateCommit)) {
    throw new Error("SKOPOS_WEB_CANDIDATE_SHA must be a full lowercase Git commit SHA.");
  }
  if (environment.NODE_ENV === "production" && !candidateCommit) {
    throw new Error(
      "SKOPOS_WEB_CANDIDATE_SHA must identify the deployed source commit for a production web build.",
    );
  }

  return {
    ...canonicalWebIdentity,
    candidateCommit,
    environment: environment.NODE_ENV === "production" ? "production" : "development",
  } as const;
}
