// src/types.ts
export interface VideoMeta {
  filename: string; // e.g., "12345.mp4"
  title: string; // child-friendly display title from filename
  publicUrl: string; // full URL to file in Supabase storage
}
