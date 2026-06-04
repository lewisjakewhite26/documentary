// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { VideoMeta } from '../types';
import { displayVideoTitle, isCheetahRunningClip } from './display';
import {
  getSupabaseConfigMessage,
  isSupabaseConfigured,
  isSupabaseEnvValid,
} from './env';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export { isSupabaseConfigured, isSupabaseEnvValid, getSupabaseConfigMessage };

export const SUPABASE_CONFIG_MESSAGE = getSupabaseConfigMessage();

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!isSupabaseEnvValid) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

/** Shared client for storage helpers (e.g. music). */
export function getSupabaseClient(): SupabaseClient | null {
  return getSupabase();
}

export const STORAGE_BUCKET = 'portfolio-images';
export const STORAGE_FOLDER = 'summer2/';

const VIDEO_FILE_PATTERN = /\.(mp4|mov|webm|m4v)$/i;

/** Category display name → file prefix (spaces become hyphens, lowercase). */
export function categoryToFilePrefix(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function fileMatchesCategory(filename: string, category: string): boolean {
  const prefix = categoryToFilePrefix(category);
  return filename.toLowerCase().startsWith(`${prefix}-`);
}

/** Public URL for a file in the portfolio-images / summer2/ bucket. */
export function getVideoPublicUrl(filename: string): string | null {
  const client = getSupabase();
  if (!client) return null;
  const { data } = client.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(`${STORAGE_FOLDER}${filename}`);
  return data.publicUrl;
}

function fileToVideoMeta(filename: string): VideoMeta {
  const publicUrl = getVideoPublicUrl(filename);
  return {
    filename,
    title: displayVideoTitle(filename),
    publicUrl: publicUrl ?? '',
  };
}

export type FetchAllVideosResult = {
  byCategory: Record<string, VideoMeta[]>;
  error: string | null;
};

const INTRO_CATEGORY = 'intro';

/**
 * List all video files under summer2/ once, then partition by category filename prefix.
 * Animal rows match hyphenated prefixes (e.g. "great-white-shark-123.mp4").
 * Any other video (habitat/scene prefixes) is grouped into "intro".
 */
export async function fetchAllVideos(
  categoryNames: string[]
): Promise<FetchAllVideosResult> {
  const byCategory = Object.fromEntries(
    categoryNames.map((name) => [name, [] as VideoMeta[]])
  ) as Record<string, VideoMeta[]>;

  const client = getSupabase();
  if (!client) {
    return { byCategory, error: null };
  }

  const hasIntro = INTRO_CATEGORY in byCategory;
  const namedCategories = categoryNames.filter((name) => name !== INTRO_CATEGORY);

  // Longest prefixes first so "great white shark" wins over a shorter shared prefix if added later
  const categoriesByPrefixLength = [...namedCategories].sort(
    (a, b) => categoryToFilePrefix(b).length - categoryToFilePrefix(a).length
  );

  const files: { name: string }[] = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const { data, error } = await client.storage.from(STORAGE_BUCKET).list(STORAGE_FOLDER, {
      limit: pageSize,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      console.error('Supabase list error:', error);
      return { byCategory, error: error.message };
    }

    if (!data?.length) break;
    files.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }

  for (const file of files) {
    if (!VIDEO_FILE_PATTERN.test(file.name)) continue;

    let matched = false;
    for (const category of categoriesByPrefixLength) {
      if (fileMatchesCategory(file.name, category)) {
        byCategory[category].push(fileToVideoMeta(file.name));
        matched = true;
        break;
      }
    }

    if (!matched && hasIntro) {
      byCategory[INTRO_CATEGORY].push(fileToVideoMeta(file.name));
    }
  }

  if ('cheetah' in byCategory) {
    byCategory.cheetah.sort((a, b) => {
      const aRunning = isCheetahRunningClip(a.filename);
      const bRunning = isCheetahRunningClip(b.filename);
      if (aRunning !== bRunning) return aRunning ? -1 : 1;
      return a.filename.localeCompare(b.filename);
    });
  }

  return { byCategory, error: null };
}
