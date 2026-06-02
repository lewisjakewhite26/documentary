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

/**
 * Friendly title for UI and screen readers (e.g. "crocodile-3.mp4" → "Crocodile — Clip 3").
 */
export function displayVideoTitle(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, '');
  const lower = base.toLowerCase();

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

  if (lower.startsWith('intro-')) {
    return `Intro — ${formatClipSuffix(base.slice('intro-'.length))}`;
  }

  return formatHyphenatedSlug(base);
}
