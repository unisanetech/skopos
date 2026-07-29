export * from './application/build-console-app/build-console-app.service.js';
export * from './application/build-console-state/build-console-state.service.js';
export * from './application/dev-console-app/dev-console-app.service.js';
export * from './application/load-activity-views/load-activity-views.service.js';
export * from './application/load-graph-views/load-graph-views.service.js';
export * from './application/render-portal/render-portal.service.js';
export * from './application/serve-console-app/serve-console-app.service.js';
export * from './contracts/skopos-ui-activity-view.js';
export * from './contracts/skopos-ui-console-app.js';
export * from './contracts/skopos-ui-console-state.js';
export * from './contracts/skopos-ui-graph-view.js';
export * from './contracts/skopos-ui-portal.js';

export const skoposUiSections = [
  'overview',
  'architecture',
  'scopes',
  'decisions',
  'findings',
  'readiness',
  'activity',
  'graphs',
] as const;
