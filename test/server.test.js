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
