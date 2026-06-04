import { STORAGE_BUCKET, getSupabaseClient } from './supabase';

export const MUSIC_FOLDER = 'Music/';

export const MUSIC_AUDIO_PATTERN = /\.(mp3|m4a|ogg|wav)$/i;

export const MUSIC_VOLUME = 0.28;

const MUSIC_STORAGE_KEY = 'mrwhiteflix-music-enabled';

export function filterMusicFilenames(names: string[]): string[] {
  return names.filter((name) => MUSIC_AUDIO_PATTERN.test(name)).sort();
}

export function getMusicPublicUrl(filename: string): string | null {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = client.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(`${MUSIC_FOLDER}${filename}`);
  return data.publicUrl;
}

export type FetchMusicTracksResult = {
  tracks: string[];
  error: string | null;
};

export async function fetchMusicTracks(): Promise<FetchMusicTracksResult> {
  const client = getSupabaseClient();
  if (!client) {
    return { tracks: [], error: null };
  }

  const { data, error } = await client.storage.from(STORAGE_BUCKET).list(MUSIC_FOLDER, {
    limit: 100,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error('Supabase music list error:', error);
    return { tracks: [], error: error.message };
  }

  return { tracks: filterMusicFilenames((data ?? []).map((f) => f.name)), error: null };
}

export function readMusicEnabledPreference(): boolean {
  try {
    return sessionStorage.getItem(MUSIC_STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

export function writeMusicEnabledPreference(enabled: boolean): void {
  try {
    sessionStorage.setItem(MUSIC_STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    /* ignore */
  }
}
