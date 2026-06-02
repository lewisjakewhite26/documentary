// src/components/Row.tsx — video grid for a category (no horizontal scroll)
import React from 'react';
import type { VideoMeta } from '../types';
import Card from './Card';

interface RowProps {
  title: string;
  videos: VideoMeta[];
  loading: boolean;
  error: string | null;
  onVideoSelect: (video: VideoMeta) => void;
}

const SKELETON_COUNT = 8;

const Row: React.FC<RowProps> = ({ title, videos, loading, error, onVideoSelect }) => {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>

      {loading ? (
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-400 text-base" role="alert">
          Could not load videos: {error}
        </p>
      ) : videos.length === 0 ? (
        <p className="text-gray-400 text-base">No videos in this category yet.</p>
      ) : (
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {videos.map((video) => (
            <Card key={video.filename} video={video} onSelect={onVideoSelect} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Row;
