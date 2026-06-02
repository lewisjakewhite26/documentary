import { describe, expect, it } from 'vitest';
import { categoryToFilePrefix, fileMatchesCategory } from './supabase';

describe('categoryToFilePrefix', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(categoryToFilePrefix('Great White Shark')).toBe('great-white-shark');
  });
});

describe('fileMatchesCategory', () => {
  it('matches animal prefix with trailing id', () => {
    expect(fileMatchesCategory('lion-12.mp4', 'lion')).toBe(true);
  });

  it('does not match partial prefix', () => {
    expect(fileMatchesCategory('lionfish-1.mp4', 'lion')).toBe(false);
  });

  it('matches multi-word categories', () => {
    expect(fileMatchesCategory('polar-bear-2.mp4', 'polar bear')).toBe(true);
  });
});
