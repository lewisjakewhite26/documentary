// src/lib/download.ts
import { getVideoPublicUrl, SUPABASE_CONFIG_MESSAGE } from './supabase';

export type DownloadResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Download a video file from Supabase storage as an MP4.
 * Uses fetch to retrieve the blob, creates an object URL, and programmatically clicks a hidden anchor.
 * Works on iPad Safari because it uses a user‑initiated click (the card's onClick).
 */
export async function downloadVideo(filename: string): Promise<DownloadResult> {
  const publicUrl = getVideoPublicUrl(filename);
  if (!publicUrl) {
    return { ok: false, message: SUPABASE_CONFIG_MESSAGE };
  }
  try {
    const response = await fetch(publicUrl);
    if (!response.ok) {
      console.error('Failed to fetch video for download', response.status);
      return {
        ok: false,
        message: `Download failed (${response.status}). Please try again.`,
      };
    }
    const blob = await response.blob();
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
