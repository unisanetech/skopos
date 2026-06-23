export const resolveSkoposRuntimeActorId = (actor?: string): string | undefined => {
  const candidate = actor?.trim() || process.env.SKOPOS_ACTOR?.trim();
  return candidate && candidate.length > 0 ? candidate : undefined;
};
