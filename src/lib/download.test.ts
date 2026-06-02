import { describe, expect, it } from 'vitest';
import {
  formatDownloadSize,
  isLargeDownload,
  LARGE_DOWNLOAD_BYTES,
} from './download';

describe('formatDownloadSize', () => {
  it('formats kilobytes', () => {
    expect(formatDownloadSize(512_000)).toBe('500 KB');
  });

  it('formats megabytes', () => {
    expect(formatDownloadSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });
});

describe('isLargeDownload', () => {
  it('is true at the large threshold', () => {
    expect(isLargeDownload(LARGE_DOWNLOAD_BYTES)).toBe(true);
  });

  it('is false when size unknown', () => {
    expect(isLargeDownload(null)).toBe(false);
  });
});
