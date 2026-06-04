import { useEffect, useState } from 'react';
import { fetchMusicTracks } from '../lib/music';
import { isSupabaseEnvValid } from '../lib/supabase';

export function useMusicTracks() {
  const [tracks, setTracks] = useState<string[]>([]);
  const [loading, setLoading] = useState(isSupabaseEnvValid);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseEnvValid) return;

    let cancelled = false;
    void fetchMusicTracks().then(({ tracks: list, error: err }) => {
      if (cancelled) return;
      setTracks(list);
      setError(err);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { tracks, loading, error, count: tracks.length };
}
