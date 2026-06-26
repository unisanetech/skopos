import { existsSync } from 'node:fs';
import { access, readFile, stat } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { SkoposUiConsoleDevResult } from '../../contracts/skopos-ui-console-app.js';
import {
  skoposUiDevFileEndpointPath,
  skoposUiDevStateEndpointPath,
  skoposUiDevStateUpdatedEvent,
} from '../../contracts/skopos-ui-dev-channel.js';
import { buildSkoposUiConsoleState } from '../build-console-state/build-console-state.service.js';

import type { Connect, InlineConfig, ViteDevServer } from 'vite';

export interface DevSkoposUiConsoleAppOptions {
  cwd: string;
  host?: string;
  port?: number;
  createViteDevServer?: (config: InlineConfig) => Promise<ViteDevServer>;
}

export const devSkoposUiConsoleApp = async ({
  cwd,
  host = '127.0.0.1',
  port = 4173,
  createViteDevServer,
}: DevSkoposUiConsoleAppOptions): Promise<SkoposUiConsoleDevResult> => {
  const workspaceRoot = resolve(cwd);
  const packageRoot = resolveUiPackageRoot(import.meta.url);
  const ignoredWatchTargets = watchIgnoredTargets(workspaceRoot);
  let currentState = await buildCurrentState(workspaceRoot);
  let debounceHandle: ReturnType<typeof setTimeout> | undefined;
  let refreshQueued = false;
  let refreshInFlight: Promise<void> | undefined;

  const createServer = createViteDevServer ?? (await import('vite')).createServer;
  const server = await createServer({
    configFile: resolve(packageRoot, 'vite.config.ts'),
    server: {
      host,
      port,
      fs: {
        allow: [packageRoot, workspaceRoot],
      },
      watch: {
        ignored: ignoredWatchTargets,
      },
    },
    logLevel: 'silent',
    plugins: [
      {
        name: 'skopos-ui-dev-state',
        configureServer(viteServer) {
          viteServer.middlewares.use(skoposUiDevStateEndpointPath, async (_request, response) => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.setHeader('Cache-Control', 'no-cache');
            response.end(`${JSON.stringify(currentState)}\n`);
          });

          viteServer.middlewares.use(
            skoposUiDevFileEndpointPath,
            createWorkspaceFileMiddleware(workspaceRoot),
          );

          viteServer.watcher.add(watchTargets(workspaceRoot));

          const scheduleRefresh = (): void => {
            if (debounceHandle) {
              clearTimeout(debounceHandle);
            }
            debounceHandle = setTimeout(() => {
              debounceHandle = undefined;
              void refreshState(viteServer);
            }, 75);
          };

          const onWorkspaceChange = (filePath: string): void => {
            if (!shouldRefreshForPath(workspaceRoot, filePath)) {
              return;
            }
            scheduleRefresh();
          };

          viteServer.watcher.on('add', onWorkspaceChange);
          viteServer.watcher.on('change', onWorkspaceChange);
          viteServer.watcher.on('unlink', onWorkspaceChange);

          const refreshState = async (activeServer: ViteDevServer): Promise<void> => {
            if (refreshInFlight) {
              refreshQueued = true;
              return refreshInFlight;
            }

            refreshInFlight = (async () => {
              try {
                currentState = await buildCurrentState(workspaceRoot);
                activeServer.ws.send({
                  type: 'custom',
                  event: skoposUiDevStateUpdatedEvent,
                  data: {
                    generatedAt: currentState.generatedAt,
                  },
                });
              } catch (error) {
                activeServer.config.logger.error(
                  `Skopos UI dev refresh failed: ${error instanceof Error ? error.message : 'unknown error'}`,
                  {
                    clear: false,
                    timestamp: true,
                  },
                );
              } finally {
                refreshInFlight = undefined;
                if (refreshQueued) {
                  refreshQueued = false;
                  scheduleRefresh();
                }
              }
            })();

            return refreshInFlight;
          };
        },
      },
    ],
  });

  await server.listen();

  const resolvedUrl = resolveDevServerUrl(server, host, port);

  return {
    workspaceRoot,
    host: resolvedUrl.host,
    port: resolvedUrl.port,
    url: resolvedUrl.url,
    stateEndpointPath: skoposUiDevStateEndpointPath,
    fileEndpointPath: skoposUiDevFileEndpointPath,
    generatedAt: currentState.generatedAt,
    trustLevel: currentState.trustReport.trustLevel,
    readiness: currentState.trustReport.readiness,
    state: currentState,
    server: {
      close: async () => {
        if (debounceHandle) {
          clearTimeout(debounceHandle);
        }
        await server.close();
      },
    },
  };
};

const buildCurrentState = async (workspaceRoot: string) =>
  buildSkoposUiConsoleState({
    cwd: workspaceRoot,
    linkMode: 'dev-server',
    fileHrefBasePath: skoposUiDevFileEndpointPath,
  });

const resolveDevServerUrl = (
  server: ViteDevServer,
  host: string,
  port: number,
): { url: string; host: string; port: number } => {
  const localUrl = server.resolvedUrls?.local[0];
  if (localUrl) {
    const parsed = new URL(localUrl);
    return {
      url: localUrl,
      host: parsed.hostname,
      port: Number(parsed.port),
    };
  }

  return {
    url: `http://${host}:${port}`,
    host,
    port,
  };
};

const watchTargets = (workspaceRoot: string): string[] => [
  resolve(workspaceRoot, 'docs', '**', '*.md'),
  resolve(workspaceRoot, 'docs', '**', '*.mdx'),
  resolve(workspaceRoot, 'docs', '**', '*.txt'),
  resolve(workspaceRoot, 'docs', '**', '*.json'),
  resolve(workspaceRoot, 'docs', '**', '*.yaml'),
  resolve(workspaceRoot, 'docs', '**', '*.yml'),
  resolve(workspaceRoot, '.skopos', 'bootstrap.json'),
  resolve(workspaceRoot, '.skopos', 'diagnosis.json'),
  resolve(workspaceRoot, '.skopos', 'index.json'),
  resolve(workspaceRoot, '.skopos', 'scopes-lite.json'),
  resolve(workspaceRoot, '.skopos', 'architecture.json'),
  resolve(workspaceRoot, '.skopos', 'enforcement.json'),
  resolve(workspaceRoot, '.skopos', 'proof', 'latest-report.json'),
  resolve(workspaceRoot, '.skopos', 'plans', '*.json'),
  resolve(workspaceRoot, '.skopos', 'missions', '*.json'),
  resolve(workspaceRoot, '.skopos', 'graph', '*.json'),
  resolve(workspaceRoot, '.skopos', 'runs', '*.json'),
  resolve(workspaceRoot, '.skopos', 'log.jsonl'),
  resolve(workspaceRoot, 'AGENTS.md'),
  resolve(workspaceRoot, 'skopos.config.yaml'),
  resolve(workspaceRoot, 'tools', 'skopos', 'workflows', '**', '*.yaml'),
  resolve(workspaceRoot, 'tools', 'skopos', 'workflows', '**', '*.yml'),
  resolve(workspaceRoot, 'tools', 'skopos', 'workflows', '**', '*.json'),
  resolve(workspaceRoot, 'tools', 'skopos', 'workflows', '**', '*.md'),
];

const watchIgnoredTargets = (workspaceRoot: string): string[] => [
  resolve(workspaceRoot, 'docs', 'generated', 'skopos', 'app', '**'),
  resolve(workspaceRoot, '.skopos', 'tooling', '**'),
];

const ignoredRefreshRoots = (workspaceRoot: string): string[] => [
  resolve(workspaceRoot, 'docs', 'generated', 'skopos', 'app'),
  resolve(workspaceRoot, '.skopos', 'tooling'),
];

const shouldRefreshForPath = (workspaceRoot: string, changedPath: string): boolean => {
  const resolvedPath = resolve(changedPath);
  if (ignoredRefreshRoots(workspaceRoot).some((candidate) => isPathWithin(candidate, resolvedPath))) {
    return false;
  }

  return (
    isPathWithin(workspaceRoot, resolvedPath) &&
    [
      resolve(workspaceRoot, 'docs'),
      resolve(workspaceRoot, '.skopos'),
      resolve(workspaceRoot, 'AGENTS.md'),
      resolve(workspaceRoot, 'skopos.config.yaml'),
      resolve(workspaceRoot, 'tools', 'skopos', 'workflows'),
    ].some((candidate) => isPathWithin(candidate, resolvedPath) || candidate === resolvedPath)
  );
};

const createWorkspaceFileMiddleware = (
  workspaceRoot: string,
): Connect.NextHandleFunction => async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? skoposUiDevFileEndpointPath, 'http://127.0.0.1');
    const requestedPath = requestUrl.searchParams.get('path');
    if (!requestedPath) {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      response.end('Missing ?path= for Skopos UI file request.');
      return;
    }

    const filePath = resolve(requestedPath);
    if (!isPathWithin(workspaceRoot, filePath) || !(await isReadableFile(filePath))) {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      response.end('Skopos UI file target was not found.');
      return;
    }

    const fileStat = await stat(filePath);
    response.statusCode = 200;
    response.setHeader('Content-Type', contentTypeFor(filePath));
    response.setHeader('Content-Length', String(fileStat.size));
    response.setHeader('Cache-Control', 'no-cache');

    response.end(await readFile(filePath));
  } catch (error) {
    response.statusCode = 500;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end(
      `Skopos UI file request failed: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
  }
};

const isPathWithin = (rootPath: string, candidatePath: string): boolean => {
  const relativePath = relative(resolve(rootPath), resolve(candidatePath));
  return relativePath === '' || (!relativePath.startsWith(`..${sep}`) && relativePath !== '..');
};

function resolveUiPackageRoot(moduleUrl: string): string {
  let currentPath = resolve(fileURLToPath(new URL('.', moduleUrl)));

  for (let depth = 0; depth < 6; depth += 1) {
    if (existsSync(resolve(currentPath, 'vite.config.ts')) && existsSync(resolve(currentPath, 'package.json'))) {
      return currentPath;
    }
    currentPath = resolve(currentPath, '..');
  }

  throw new Error('Could not resolve the @skopos/ui package root for the Vite app.');
}

const isReadableFile = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
};

const contentTypeFor = (filePath: string): string => {
  switch (extname(filePath).toLowerCase()) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.jsonl':
      return 'application/json; charset=utf-8';
    case '.md':
    case '.txt':
    case '.log':
    case '.yaml':
    case '.yml':
      return 'text/plain; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
};
