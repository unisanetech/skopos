import type { SkoposScopeLite } from '@skopos/model';

export const resolveSkoposScopeContextIds = (
  scope: SkoposScopeLite,
): string[] => [
  ...new Set([
    scope.id,
    ...(scope.ancestorIds ?? []),
    ...(scope.parent ? [scope.parent] : []),
  ]),
];
