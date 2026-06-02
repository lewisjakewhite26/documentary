// src/types.ts
export interface VideoMeta {
  filename: string; // e.g., "12345.mp4"
  title: string; // derived from filename (without extension)
  publicUrl: string; // full URL to file in Supabase storage
}
