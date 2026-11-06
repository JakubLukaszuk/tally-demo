import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countWords } from '../src/count.js';

test('counts words and unique words, case-insensitively', () => {
  const r = countWords('The cat and the dog');
  assert.equal(r.total, 5);
  assert.equal(r.unique, 4);
});

test('empty text has no words', () => {
  assert.equal(countWords('   ').total, 0);
});
