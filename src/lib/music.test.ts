import { describe, expect, it } from 'vitest';
import { displayMusicTitle, filterMusicFilenames } from './music';

describe('filterMusicFilenames', () => {
  it('keeps audio extensions and sorts', () => {
    expect(
      filterMusicFilenames(['b.txt', 'calm-nature-2.mp3', 'calm-nature-1.mp3', 'note.mp4'])
    ).toEqual(['calm-nature-1.mp3', 'calm-nature-2.mp3']);
  });
});

describe('displayMusicTitle', () => {
  it('uses simple numbered labels for children', () => {
    expect(displayMusicTitle(0)).toBe('Calm nature sound 1');
    expect(displayMusicTitle(3)).toBe('Calm nature sound 4');
  });
});
