#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { countWords } from './count.js';

const args = process.argv.slice(2);
const json = args.includes('--json');
const file = args.find((a) => a !== '--json');
if (!file) {
  console.error('usage: tally [--json] <file>');
  process.exit(2);
}
const { total, unique } = countWords(readFileSync(file, 'utf8'));
console.log(json ? JSON.stringify({ total, unique }) : `${total} words, ${unique} unique`);
