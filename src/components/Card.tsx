// src/components/Card.tsx
import React from 'react';
import type { VideoMeta } from '../types';
import { useInView } from '../hooks/useInView';
import { forwardVerticalWheel } from '../lib/scroll';

const PREVIEW_TIME_SEC = 0.5;

interface CardProps {
  video: VideoMeta;
  onSelect: (video: VideoMeta) => void;
}

/** Loads a single still frame only after the card scrolls into view. */
const CardThumbnail: React.FC<{ url: string }> = ({ url }) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="absolute inset-0 bg-zinc-800">
      {inView && (
        <video
          src={url}
          className="w-full h-full object-cover pointer-events-none"
          muted
          playsInline
          preload="metadata"
          aria-hidden
          onLoadedData={(e) => {
            const el = e.currentTarget;
            el.muted = true;
            el.volume = 0;
            const t = Number.isFinite(el.duration)
              ? Math.min(PREVIEW_TIME_SEC, el.duration * 0.05)
              : PREVIEW_TIME_SEC;
            el.currentTime = t;
          }}
        />
      )}
    </div>
  );
};

const Card: React.FC<CardProps> = ({ video, onSelect }) => {
  return (
    <button
      type="button"
      data-video-card
      className="relative w-64 md:w-80 h-36 md:h-48 flex-shrink-0 mr-4 cursor-pointer card-hover overflow-hidden rounded-md text-left focus:outline-none focus:ring-4 focus:ring-netflix-red/70"
      onClick={() => onSelect(video)}
      onWheel={forwardVerticalWheel}
      aria-label={`Watch ${video.title}`}
    >
      {video.publicUrl ? (
        <CardThumbnail url={video.publicUrl} />
      ) : (
        <div className="absolute inset-0 bg-zinc-800" />
      )}

      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-netflix-red/90 text-white shadow-lg">
          <svg className="w-7 h-7 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    </button>
  );
};

export default Card;
