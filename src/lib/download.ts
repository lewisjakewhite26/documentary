// src/lib/download.ts
import { getMusicPublicUrl } from './music';
import { getVideoPublicUrl, SUPABASE_CONFIG_MESSAGE } from './supabase';

export type DownloadResult =
  | { ok: true }
  | { ok: false; message: string };

export type DownloadProgress = {
  loaded: number;
  total: number | null;
  /** 0–100 when total size is known; otherwise null (indeterminate). */
  percent: number | null;
};

/** Files above this size show a “large file” hint while downloading. */
export const LARGE_DOWNLOAD_BYTES = 10 * 1024 * 1024;

export function formatDownloadSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isLargeDownload(total: number | null): boolean {
  return total !== null && total >= LARGE_DOWNLOAD_BYTES;
}

/**
 * Fetch a public storage URL and save as a download (user‑initiated click).
 * Works on iPad Safari when triggered from a button press.
 */
export async function downloadFromPublicUrl(
  publicUrl: string,
  filename: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<DownloadResult> {
  const report = (loaded: number, total: number | null) => {
    onProgress?.({
      loaded,
      total,
      percent:
        total !== null && total > 0
          ? Math.min(100, Math.round((loaded / total) * 100))
          : null,
    });
  };

  try {
    const response = await fetch(publicUrl);
    if (!response.ok) {
      console.error('Failed to fetch file for download', response.status);
      return {
        ok: false,
        message: `Download failed (${response.status}). Please try again.`,
      };
    }

    const contentLength = response.headers.get('content-length');
    const totalBytes = contentLength ? Number.parseInt(contentLength, 10) : null;
    const total = Number.isFinite(totalBytes) && totalBytes! > 0 ? totalBytes! : null;

    report(0, total);

    let blob: Blob;
    if (response.body) {
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        report(loaded, total);
      }

      blob = new Blob(chunks as BlobPart[]);
      report(blob.size, blob.size);
    } else {
      blob = await response.blob();
      report(blob.size, blob.size);
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return { ok: true };
  } catch (err) {
    console.error('Download error:', err);
    return {
      ok: false,
      message: 'Download failed. Check your connection and try again.',
    };
  }
}

export async function downloadVideo(
  filename: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<DownloadResult> {
  const publicUrl = getVideoPublicUrl(filename);
  if (!publicUrl) {
    return { ok: false, message: SUPABASE_CONFIG_MESSAGE };
  }
  return downloadFromPublicUrl(publicUrl, filename, onProgress);
}

export async function downloadMusic(
  filename: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<DownloadResult> {
  const publicUrl = getMusicPublicUrl(filename);
  if (!publicUrl) {
    return { ok: false, message: SUPABASE_CONFIG_MESSAGE };
  }
  return downloadFromPublicUrl(publicUrl, filename, onProgress);
}
