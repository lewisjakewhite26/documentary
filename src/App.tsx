// src/App.tsx
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Row from './components/Row';
import VideoModal from './components/VideoModal';
import {
  fetchAllVideos,
  isSupabaseConfigured,
  SUPABASE_CONFIG_MESSAGE,
} from './lib/supabase';
import { categories, categoryNames, formatCategoryTitle } from './categories';
import type { VideoMeta } from './types';

const App: React.FC = () => {
  const [videosByCategory, setVideosByCategory] = useState<Record<string, VideoMeta[]>>({});
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoMeta | null>(null);

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
    <div className="bg-netflix-bg min-h-screen text-white font-sans">
      <Header />
      <Hero />
      {!isSupabaseConfigured && (
        <div
          className="mx-4 mt-4 px-4 py-3 bg-yellow-900/80 border border-yellow-600 rounded text-yellow-100 text-sm"
          role="status"
        >
          {SUPABASE_CONFIG_MESSAGE}
        </div>
      )}
      <main className="p-4 space-y-8">
        {categories.map((cat) => (
          <Row
            key={cat.name}
            title={cat.type === 'intro' ? 'Intro' : formatCategoryTitle(cat.name)}
            videos={videosByCategory[cat.name] ?? []}
            loading={loading}
            error={isSupabaseConfigured ? loadError : null}
            onVideoSelect={setSelectedVideo}
          />
        ))}
      </main>
      {selectedVideo && (
        <VideoModal
          key={selectedVideo.filename}
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default App;
