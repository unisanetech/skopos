import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

import type { SkoposUiConsoleServeResult } from '../../contracts/skopos-ui-console-app.js';
import { buildSkoposUiConsoleApp } from '../build-console-app/build-console-app.service.js';

export interface ServeSkoposUiConsoleAppOptions {
  cwd: string;
  outputDirectory?: string;
  host?: string;
  port?: number;
  createHttpServer?: typeof createServer;
}

export const serveSkoposUiConsoleApp = async ({
  cwd,
  outputDirectory,
  host = '127.0.0.1',
  port = 4173,
  createHttpServer = createServer,
}: ServeSkoposUiConsoleAppOptions): Promise<SkoposUiConsoleServeResult> => {
  const buildResult = await buildSkoposUiConsoleApp({
    cwd,
    outputDirectory,
  });

  const rootDirectory = buildResult.outputDirectory;
  const entryHtmlPath = buildResult.entryHtmlPath;
  const server = createHttpServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? '/', `http://${host}:${port}`);
      const requestedPath = decodeURIComponent(requestUrl.pathname);
      const candidatePath = resolveFilePath(rootDirectory, requestedPath);
      const filePath = (await isReadableFile(candidatePath)) ? candidatePath : entryHtmlPath;
      const fileStat = await stat(filePath);

      response.statusCode = 200;
      response.setHeader('Content-Type', contentTypeFor(filePath));
      response.setHeader('Content-Length', String(fileStat.size));
      response.setHeader('Cache-Control', 'no-cache');

      createReadStream(filePath).pipe(response);
    } catch (error) {
      response.statusCode = 500;
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      response.end(
        `Skopos UI serve failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  });

  const listenedPort = await new Promise<number>((resolvePort, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Skopos UI server did not expose a TCP address.'));
        return;
      }
      resolvePort(address.port);
    });
  });

  return {
    ...buildResult,
    host,
    port: listenedPort,
    url: `http://${host}:${listenedPort}`,
    server,
  };
};

const resolveFilePath = (rootDirectory: string, requestedPath: string): string => {
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.slice(1);
  const normalizedRelativePath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  return join(rootDirectory, normalizedRelativePath);
};

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
