import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const inv = readFileSync(join(root, 'summer2-inventory.js'), 'utf8');
const names = [...inv.matchAll(/"name": "([^"]+)"/g)].map((m) => m[1]);

const animals = [
  'bald eagle',
  'cheetah',
  'crocodile',
  'dolphin',
  'electric eel',
  'elephant',
  'flamingo',
  'giraffe',
  'gorilla',
  'great white shark',
  'lion',
  'octopus',
  'orca',
  'penguin',
  'polar bear',
  'sea turtle',
  'wolf',
];

const toPrefix = (n) => n.toLowerCase().replace(/\s+/g, '-');
const prefixes = animals.map(toPrefix).sort((a, b) => b.length - a.length);

const videos = names.filter((n) => /\.(mp4|mov|webm|m4v)$/i.test(n));

function matchAnimal(file) {
  const lower = file.toLowerCase().replace(/\.[^/.]+$/, '');
  if (lower.startsWith('cheetah-running-')) return 'cheetah';
  for (const p of prefixes) {
    if (lower.startsWith(`${p}-`)) return p;
  }
  return null;
}

function inferPrefix(file) {
  let b = file.toLowerCase().replace(/\.[^/.]+$/, '').replace(/\s*\(\d+\)$/, '');
  const parts = b.split('-');
  while (parts.length && /^\d+$/.test(parts[parts.length - 1])) parts.pop();
  return parts.join('-');
}

const matched = {};
const unmatched = {};

for (const file of videos) {
  const m = matchAnimal(file);
  if (m) {
    matched[m] = (matched[m] || 0) + 1;
    continue;
  }
  const inf = inferPrefix(file);
  if (!unmatched[inf]) unmatched[inf] = [];
  unmatched[inf].push(file);
}

console.log('=== MATCHED (current animals) ===');
for (const [k, v] of Object.entries(matched).sort((a, b) => b[1] - a[1])) {
  console.log(String(v).padStart(3), k);
}

console.log('\n=== UNMATCHED (intro unless we add animal) ===');
for (const [k, arr] of Object.entries(unmatched).sort((a, b) => b[1].length - a[1].length)) {
  console.log(String(arr.length).padStart(3), k, '→', arr[0]);
}

console.log('\nTotal videos:', videos.length);
