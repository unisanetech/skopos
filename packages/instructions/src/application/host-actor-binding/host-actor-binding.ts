export const buildHostActorBinding = () =>
  ({
    source: 'environment-variable',
    variable: 'SKOPOS_ACTOR',
    requiredForTaskSpecificRouting: true,
    fallback: 'none',
    sessionId: {
      role: 'discussion-continuity-and-coordination',
      acceptedAsActorId: false,
    },
  }) as const;
