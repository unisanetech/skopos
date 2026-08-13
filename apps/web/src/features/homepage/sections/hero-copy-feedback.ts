export type HeroCopyStatus = "idle" | "copying" | "copied" | "failed";

export function getHeroCopyFeedback(status: HeroCopyStatus) {
  if (status === "copied") return { icon: "check" as const, label: "Copied" };
  if (status === "failed") return { icon: "error" as const, label: "Copy failed" };
  if (status === "copying") return { icon: "content_copy" as const, label: "Copying" };
  return { icon: "content_copy" as const, label: "Copy" };
}
