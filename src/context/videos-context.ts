import { createContext } from 'react';
import type { VideoMeta } from '../types';

export type VideosContextValue = {
  videosByCategory: Record<string, VideoMeta[]>;
  loading: boolean;
  loadError: string | null;
};

export const VideosContext = createContext<VideosContextValue | null>(null);
