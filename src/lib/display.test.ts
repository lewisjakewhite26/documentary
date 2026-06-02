import { describe, expect, it } from 'vitest';
import { displayVideoTitle, formatClipSuffix } from './display';

describe('formatClipSuffix', () => {
  it('formats numeric ids as clips', () => {
    expect(formatClipSuffix('42')).toBe('Clip 42');
  });

  it('formats hyphenated ids as words', () => {
    expect(formatClipSuffix('reef-close-up')).toBe('Reef Close Up');
  });
});

describe('displayVideoTitle', () => {
  it('titles crocodile videos', () => {
    expect(displayVideoTitle('crocodile-3.mp4')).toBe('Crocodile — Clip 3');
  });

  it('titles great white shark with longest prefix', () => {
    expect(displayVideoTitle('great-white-shark-99.mp4')).toBe('Great White Shark — Clip 99');
  });

  it('titles intro-prefixed files', () => {
    expect(displayVideoTitle('intro-welcome.mp4')).toBe('Intro — Welcome');
  });

  it('falls back to hyphenated words for habitat files', () => {
    expect(displayVideoTitle('savanna-sunset.mp4')).toBe('Savanna Sunset');
  });
});
