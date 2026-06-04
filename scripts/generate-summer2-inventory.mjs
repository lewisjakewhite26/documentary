import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const env = Object.fromEntries(
  readFileSync(join(root, '.env'), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i), line.slice(i + 1)];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const { data, error } = await supabase.storage.from('portfolio-images').list('summer2/', {
  limit: 1000,
  offset: 0,
  sortBy: { column: 'name', order: 'asc' },
});

if (error) {
  console.error('List failed:', error.message);
  process.exit(1);
}

const files = (data ?? []).map((f) => ({
  name: f.name,
  id: f.id,
  updated_at: f.updated_at,
  created_at: f.created_at,
  metadata: f.metadata ?? null,
}));

const supabaseUrl = env.VITE_SUPABASE_URL;

const output = `/**
 * Inventory of portfolio-images / summer2/
 * Generated: ${new Date().toISOString()}
 * Total files: ${files.length}
 *
 * Re-run: node scripts/generate-summer2-inventory.mjs
 */

export const SUPABASE_URL = ${JSON.stringify(supabaseUrl)};
export const SUMMER2_BUCKET = 'portfolio-images';
export const SUMMER2_FOLDER = 'summer2/';

export const summer2Files = ${JSON.stringify(files, null, 2)};

export const summer2FileNames = summer2Files.map((f) => f.name);

export function getSummer2PublicUrl(filename) {
  return \`\${SUPABASE_URL}/storage/v1/object/public/\${SUMMER2_BUCKET}/\${SUMMER2_FOLDER}\${filename}\`;
}

/** Group filenames by first path segment (animal slug before second hyphen), rough heuristic */
export function groupSummer2ByPrefix() {
  const groups = {};
  for (const name of summer2FileNames) {
    const base = name.replace(/\\.[^/.]+$/, '');
    const key = base.includes('-') ? base.split('-').slice(0, 2).join('-') : base;
    if (!groups[key]) groups[key] = [];
    groups[key].push(name);
  }
  return groups;
}
`;

const outPath = join(root, 'summer2-inventory.js');
writeFileSync(outPath, output);
console.log(`Wrote ${outPath} (${files.length} files)`);
