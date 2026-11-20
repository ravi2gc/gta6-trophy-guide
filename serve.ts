// Vice Atlas — local static server for trying the guide in a browser.
//
// Serves app/ on http://localhost:8080 (or --port <n>). Standard library
// only, no build step, nothing but static files. This is a development
// convenience, not a server for the internet.

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = resolve(fileURLToPath(new URL('./app', import.meta.url)));

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function pickPort(): number {
  const args = process.argv.slice(2);
  const at = args.indexOf('--port');
  const wanted = at === -1 ? 8080 : Number(args[at + 1]);
  return Number.isInteger(wanted) && wanted > 0 && wanted < 65536 ? wanted : 8080;
}

function resolveInside(requestPath: string): string | null {
  let cleaned = requestPath;
  if (cleaned.endsWith('/')) cleaned += 'index.html';
  const file = resolve(join(APP_ROOT, normalize(cleaned)));
  if (file !== APP_ROOT && !file.startsWith(APP_ROOT + sep)) return null;
  return file;
}

const server = createServer((req, res) => {
  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('bad request');
    return;
  }
  const file = resolveInside(pathname);
  if (file === null) {
    res.writeHead(403).end('forbidden');
    return;
  }
  let size: number;
  try {
    const info = statSync(file);
    if (!info.isFile()) throw new Error('not a file');
    size = info.size;
  } catch {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, {
    'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'content-length': size,
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(res);
});

const port = pickPort();
server.listen(port, '127.0.0.1', () => {
  console.log(`Vice Atlas is on http://localhost:${port}`);
});
