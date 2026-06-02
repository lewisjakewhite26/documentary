// src/components/Row.tsx
import React from 'react';
import type { VideoMeta } from '../types';
import Card from './Card';
import { useDragScroll } from '../hooks/useDragScroll';
import { forwardVerticalWheel } from '../lib/scroll';

interface RowProps {
  title: string;
  videos: VideoMeta[];
  loading: boolean;
  error: string | null;
  onVideoSelect: (video: VideoMeta) => void;
}

const Row: React.FC<RowProps> = ({ title, videos, loading, error, onVideoSelect }) => {
  const { ref: scrollRef, handlers } = useDragScroll<HTMLDivElement>();

  const scroll = (delta: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  const showScrollControls = !loading && !error && videos.length > 0;

  return (
    <section className="relative">
      <h2 className="text-white font-bold text-lg mb-2 pl-2 md:pl-4">{title}</h2>
      <div className="relative">
        {showScrollControls && (
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
            onClick={() => scroll(-300)}
            aria-label="Scroll left"
          >
            &#9664;
          </button>
        )}
        <div
          ref={scrollRef}
          {...handlers}
          onWheel={forwardVerticalWheel}
          className={`flex overflow-x-auto scrollbar-hide space-x-4 pl-8 pr-8 min-h-36 md:min-h-48 items-center ${
            showScrollControls ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-64 md:w-80 h-36 md:h-48 bg-gray-800 flex-shrink-0 rounded-md animate-pulse" />
            ))
          ) : error ? (
            <p className="text-red-400 text-sm pl-2" role="alert">
              Could not load videos: {error}
            </p>
          ) : videos.length === 0 ? (
            <p className="text-gray-400 text-sm pl-2">No videos in this category yet.</p>
          ) : (
            videos.map((video) => (
              <Card key={video.filename} video={video} onSelect={onVideoSelect} />
            ))
          )}
        </div>
        {showScrollControls && (
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
            onClick={() => scroll(300)}
            aria-label="Scroll right"
          >
            &#9654;
          </button>
        )}
      </div>
    </section>
  );
};

export default Row;
