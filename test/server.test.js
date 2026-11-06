import { test } from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../src/server.js';

test('serves the page and the counting module, and nothing else', async (t) => {
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => server.close());
  const base = `http://localhost:${server.address().port}`;

  const page = await fetch(`${base}/`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /data-testid="result"/);

  const module = await fetch(`${base}/count.js`);
  assert.equal(module.status, 200);
  assert.match(module.headers.get('content-type'), /javascript/);

  assert.equal((await fetch(`${base}/package.json`)).status, 404);
});

test('the page announces the result, above the text box', async (t) => {
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => server.close());

  const page = await fetch(`http://localhost:${server.address().port}/`);
  const html = await page.text();
  const [result] = html.match(/<p [^>]*data-testid="result"[^>]*>/);
  assert.match(result, /aria-live="polite"/);
  assert.match(result, /aria-atomic="true"/);
  assert.ok(html.indexOf(result) < html.indexOf('data-testid="text-input"'));
});
