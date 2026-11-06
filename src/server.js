#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const ROUTES = {
  '/': ['../web/index.html', 'text/html; charset=utf-8'],
  '/count.js': ['./count.js', 'text/javascript; charset=utf-8'],
};

export const server = createServer((req, res) => {
  const route = ROUTES[new URL(req.url, 'http://localhost').pathname];
  if (!route) {
    res.writeHead(404).end('not found');
    return;
  }
  const [file, type] = route;
  res.writeHead(200, { 'content-type': type });
  res.end(readFileSync(new URL(file, import.meta.url)));
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 4173;
  server.listen(port, () => console.log(`tally web: http://localhost:${port}`));
}
