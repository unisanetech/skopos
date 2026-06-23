export interface ApiSurface {
  scopeId: string;
  serviceName: string;
}

export const API_SURFACE: ApiSurface = {
  scopeId: 'workspace',
  serviceName: 'fixture-api',
};

export function getApiSurface(): ApiSurface {
  return API_SURFACE;
}
