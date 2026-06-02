import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Row from '../components/Row';
import VideoModal from '../components/VideoModal';
import { findCategoryBySlug, formatCategoryTitle } from '../categories';
import { isSupabaseConfigured } from '../lib/supabase';
import { useVideos } from '../hooks/useVideos';
import type { VideoMeta } from '../types';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { videosByCategory, loading, loadError } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<VideoMeta | null>(null);

  const category = slug ? findCategoryBySlug(slug) : undefined;

  if (!slug || !category) {
    return <Navigate to="/" replace />;
  }

  const title = category.type === 'intro' ? 'Intro' : formatCategoryTitle(category.name);
  const videos = videosByCategory[category.name] ?? [];

  return (
    <Layout>
      <main className="p-4 md:p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-lg font-semibold text-gray-300 hover:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-netflix-red rounded px-2 py-1"
        >
          ← Back home
        </Link>

        <Row
          title={title}
          videos={videos}
          loading={loading}
          error={isSupabaseConfigured ? loadError : null}
          onVideoSelect={setSelectedVideo}
        />
      </main>

      {selectedVideo && (
        <VideoModal
          key={selectedVideo.filename}
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </Layout>
  );
};

export default CategoryPage;
