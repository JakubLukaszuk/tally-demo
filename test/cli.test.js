import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../src/cli.js', import.meta.url));
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });

let dir, notes, empty, blank;

before(() => {
  dir = mkdtempSync(join(tmpdir(), 'tally-'));
  notes = join(dir, 'notes.txt');
  empty = join(dir, 'empty.txt');
  blank = join(dir, 'blank.txt');
  writeFileSync(notes, 'The cat and the dog');
  writeFileSync(empty, '');
  writeFileSync(blank, '   \n');
});

after(() => rmSync(dir, { recursive: true, force: true }));

test('prints the sentence without the flag', () => {
  const r = run(notes);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '5 words, 4 unique\n');
  assert.equal(r.stderr, '');
});

test('--json prints one line of compact JSON', () => {
  const r = run('--json', notes);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '{"total":5,"unique":4}\n');
  assert.equal(r.stderr, '');
});

test('--json works after the file', () => {
  const r = run(notes, '--json');
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '{"total":5,"unique":4}\n');
  assert.equal(r.stderr, '');
});

test('the first file wins when two are given', () => {
  const r = run(notes, empty);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '5 words, 4 unique\n');
  assert.equal(r.stderr, '');
});

test('--json counts the first file when two are given', () => {
  const r = run('--json', notes, empty);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '{"total":5,"unique":4}\n');
  assert.equal(r.stderr, '');
});

test('--json reports zero counts for an empty file', () => {
  const r = run('--json', empty);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '{"total":0,"unique":0}\n');
  assert.equal(r.stderr, '');
});

test('--json reports zero counts for a whitespace-only file', () => {
  const r = run('--json', blank);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '{"total":0,"unique":0}\n');
  assert.equal(r.stderr, '');
});

test('--json without a file is a usage error', () => {
  const r = run('--json');
  assert.equal(r.status, 2);
  assert.equal(r.stdout, '');
  assert.equal(r.stderr, 'usage: tally [--json] <file>\n');
});

test('no arguments is a usage error', () => {
  const r = run();
  assert.equal(r.status, 2);
  assert.equal(r.stdout, '');
  assert.equal(r.stderr, 'usage: tally [--json] <file>\n');
});
