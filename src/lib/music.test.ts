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
    expect(displayMusicTitle('calm-nature-789300.mp3', 0)).toBe('Calm nature sound 1');
    expect(displayMusicTitle('calm-nature-789302.mp3', 3)).toBe('Calm nature sound 4');
  });
});
