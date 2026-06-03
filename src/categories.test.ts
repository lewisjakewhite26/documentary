import { describe, expect, it } from 'vitest';
import {
  categoryToSlug,
  findCategoryBySlug,
  formatCategoryTitle,
} from './categories';

describe('formatCategoryTitle', () => {
  it('capitalizes each word', () => {
    expect(formatCategoryTitle('great white shark')).toBe('Great White Shark');
  });
});

describe('categoryToSlug', () => {
  it('hyphenates multi-word animals', () => {
    expect(categoryToSlug('polar bear')).toBe('polar-bear');
  });
});

describe('findCategoryBySlug', () => {
  it('finds crocodile', () => {
    expect(findCategoryBySlug('crocodile')?.name).toBe('crocodile');
  });

  it('finds electric eel by slug', () => {
    expect(findCategoryBySlug('electric-eel')?.name).toBe('electric eel');
  });

  it('returns undefined for unknown slugs', () => {
    expect(findCategoryBySlug('unicorn')).toBeUndefined();
  });
});
