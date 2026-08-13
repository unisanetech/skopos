export type FragmentTarget = Pick<HTMLElement, "focus" | "scrollIntoView">;

export type FragmentTargetRoot = {
  getElementById(id: string): FragmentTarget | null;
};

export function resolveFragmentId<T extends string>(
  hash: string,
  validIds: readonly T[],
): T | undefined {
  if (!hash.startsWith("#")) return undefined;

  let id: string;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return undefined;
  }

  return validIds.find((candidate) => candidate === id);
}

export function revealFragmentTarget(
  id: string,
  root: FragmentTargetRoot = document,
): boolean {
  const target = root.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ block: "start" });
  target.focus({ preventScroll: true });
  return true;
}
