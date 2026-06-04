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

  it('titles intro habitat clips', () => {
    expect(displayVideoTitle('african-savanna-11025493.mp4')).toBe(
      'Intro — African Savanna — Clip 11025493'
    );
  });

  it('falls back to intro for unknown habitat-style names', () => {
    expect(displayVideoTitle('savanna-sunset.mp4')).toBe('Intro — Savanna Sunset');
  });

  it('titles cheetah running clips', () => {
    expect(displayVideoTitle('cheetah-running-1.mp4')).toBe('Cheetah — Running fast — Clip 1');
  });
});
