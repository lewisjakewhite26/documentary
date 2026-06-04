import { describe, expect, it } from 'vitest';
import { filterMusicFilenames } from './music';

describe('filterMusicFilenames', () => {
  it('keeps audio extensions and sorts', () => {
    expect(
      filterMusicFilenames(['b.txt', 'calm-nature-2.mp3', 'calm-nature-1.mp3', 'note.mp4'])
    ).toEqual(['calm-nature-1.mp3', 'calm-nature-2.mp3']);
  });
});
