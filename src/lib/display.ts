import { animalCategories, formatCategoryTitle } from '../categories';
import { categoryToFilePrefix } from './supabase';

function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/** Turn a filename suffix (after animal prefix) into a child-friendly label. */
export function formatClipSuffix(suffix: string): string {
  if (/^\d+$/.test(suffix)) return `Clip ${suffix}`;
  return suffix
    .split('-')
    .filter(Boolean)
    .map(capitalizeWord)
    .join(' ');
}

function formatHyphenatedSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map(capitalizeWord)
    .join(' ');
}

/** Habitat / scene clips in summer2/ (no animal page) — shown under Intro. Longest first. */
const INTRO_HABITAT_PREFIXES = [
  'tropical-rainforest',
  'mountain-landscape',
  'underwater-ocean',
  'african-savanna',
  'arctic-tundra',
  'forest-floor',
  'storm-clouds',
  'coral-reef',
].sort((a, b) => b.length - a.length);

/** Filename uses cheetah-running-* for sprint / running clips (still under Cheetah category). */
export function isCheetahRunningClip(filename: string): boolean {
  return filename.toLowerCase().startsWith('cheetah-running-');
}

export function displayVideoTitle(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, '');
  const lower = base.toLowerCase();

  if (lower.startsWith('cheetah-running-')) {
    const suffix = base.slice('cheetah-running-'.length);
    return `Cheetah — Running fast — ${formatClipSuffix(suffix)}`;
  }

  const byPrefixLength = [...animalCategories].sort(
    (a, b) => categoryToFilePrefix(b.name).length - categoryToFilePrefix(a.name).length
  );

  for (const cat of byPrefixLength) {
    const prefix = categoryToFilePrefix(cat.name);
    if (lower.startsWith(`${prefix}-`)) {
      const suffix = base.slice(prefix.length + 1);
      return `${formatCategoryTitle(cat.name)} — ${formatClipSuffix(suffix)}`;
    }
  }

  for (const habitat of INTRO_HABITAT_PREFIXES) {
    if (lower.startsWith(`${habitat}-`)) {
      const suffix = base.slice(habitat.length + 1);
      return `Intro — ${formatHyphenatedSlug(habitat)} — ${formatClipSuffix(suffix)}`;
    }
  }

  if (lower.startsWith('intro-')) {
    return `Intro — ${formatClipSuffix(base.slice('intro-'.length))}`;
  }

  return `Intro — ${formatHyphenatedSlug(base)}`;
}
