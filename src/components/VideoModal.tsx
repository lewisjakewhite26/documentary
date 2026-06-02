import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { VideoMeta } from '../types';
import { downloadVideo } from '../lib/download';

interface VideoModalProps {
  video: VideoMeta;
  onClose: () => void;
}

const enforceSilent = (el: HTMLVideoElement) => {
  el.muted = true;
  el.volume = 0;
  el.defaultMuted = true;
};

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const startPlay = useCallback(async () => {
    const el = videoRef.current;
    if (!el || !video.publicUrl) return;

    setBuffering(true);
    try {
      enforceSilent(el);
      if (el.readyState < 2) {
        el.load();
      }
      await el.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    } finally {
      setBuffering(false);
    }
  }, [video.publicUrl]);

  const pause = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void startPlay();
    } else {
      pause();
    }
  }, [pause, startPlay]);

  const handleDownload = async () => {
    setDownloadError(null);
    setDownloading(true);
    const result = await downloadVideo(video.filename);
    setDownloading(false);
    if (!result.ok) {
      setDownloadError(result.message);
    }
  };

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const showPlayOverlay = !playing && !buffering;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl bg-zinc-900 shadow-2xl border border-zinc-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex items-center justify-center min-w-[3.5rem] min-h-[3.5rem] rounded-full bg-zinc-800 text-white text-3xl font-bold hover:bg-zinc-700 focus:outline-none focus:ring-4 focus:ring-white/40"
          aria-label="Close"
        >
          ×
        </button>

        <div className="px-4 pt-5 pb-3 sm:px-8 sm:pt-8">
          <h2
            id="video-modal-title"
            className="text-2xl sm:text-3xl font-bold text-white pr-16"
          >
            {video.title}
          </h2>
        </div>

        <div className="px-4 sm:px-8">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
            {video.publicUrl ? (
              <video
                ref={videoRef}
                src={video.publicUrl}
                className="w-full h-full object-contain bg-black"
                muted
                playsInline
                preload="none"
                controls={playing}
                onLoadedMetadata={(e) => enforceSilent(e.currentTarget)}
                onVolumeChange={(e) => enforceSilent(e.currentTarget)}
                onPlay={(e) => {
                  enforceSilent(e.currentTarget);
                  setPlaying(true);
                }}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onWaiting={() => setBuffering(true)}
                onCanPlay={() => setBuffering(false)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xl">
                Video unavailable
              </div>
            )}

            {buffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
                <span className="text-white text-xl font-semibold">Loading…</span>
              </div>
            )}

            {showPlayOverlay && video.publicUrl && (
              <button
                type="button"
                onClick={() => void startPlay()}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 focus:outline-none focus:ring-4 focus:ring-netflix-red/60"
                aria-label="Play video"
              >
                <span className="flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-netflix-red text-white shadow-xl">
                  <svg className="w-14 h-14 sm:w-16 sm:h-16 ml-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-white text-3xl sm:text-4xl font-bold">Play</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-8">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!video.publicUrl || buffering}
            className="flex items-center justify-center gap-3 min-h-[4.5rem] sm:min-h-20 rounded-2xl bg-white text-zinc-900 text-2xl font-bold hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            {playing ? (
              <>
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading || !video.publicUrl}
            className="flex items-center justify-center gap-3 min-h-[4.5rem] sm:min-h-20 rounded-2xl bg-netflix-red text-white text-2xl font-bold hover:bg-red-600 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-netflix-red/50"
          >
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
            </svg>
            {downloading ? 'Downloading…' : 'Download'}
          </button>
        </div>

        {downloadError && (
          <p className="px-4 pb-6 sm:px-8 text-red-400 text-lg" role="alert">
            {downloadError}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoModal;
