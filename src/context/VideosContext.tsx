import React, { useEffect, useState } from 'react';
import { categoryNames } from '../categories';
import { fetchAllVideos, isSupabaseConfigured } from '../lib/supabase';
import type { VideoMeta } from '../types';
import { VideosContext } from './videos-context';

export const VideosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videosByCategory, setVideosByCategory] = useState<Record<string, VideoMeta[]>>({});
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    const load = async () => {
      const { byCategory, error } = await fetchAllVideos(categoryNames);
      if (cancelled) return;
      setVideosByCategory(byCategory);
      setLoadError(error);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <VideosContext.Provider value={{ videosByCategory, loading, loadError }}>
      {children}
    </VideosContext.Provider>
  );
};
