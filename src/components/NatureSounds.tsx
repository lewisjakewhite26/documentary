import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  downloadMusic,
  formatDownloadSize,
  isLargeDownload,
  type DownloadProgress,
} from '../lib/download';
import { displayMusicTitle, getMusicPublicUrl } from '../lib/music';
import { isSupabaseEnvValid } from '../lib/supabase';
import { useMusicTracks } from '../hooks/useMusicTracks';

const SOUND_VOLUME = 0.45;

const NatureSounds: React.FC = () => {
  const { tracks, loading, error: loadError } = useMusicTracks();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playingFilename, setPlayingFilename] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const [activeDownload, setActiveDownload] = useState<string | null>(null);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const stopPlayback = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute('src');
    }
    setPlayingFilename(null);
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onEnded = () => setPlayingFilename(null);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('ended', onEnded);
      el.pause();
    };
  }, []);

  const togglePlay = async (filename: string) => {
    const url = getMusicPublicUrl(filename);
    if (!url) return;

    setPlayError(null);
    const el = audioRef.current;
    if (!el) return;

    if (playingFilename === filename && !el.paused) {
      stopPlayback();
      return;
    }

    el.src = url;
    el.volume = SOUND_VOLUME;
    try {
      await el.play();
      setPlayingFilename(filename);
    } catch {
      setPlayError('Could not play this sound. Tap Play again.');
      stopPlayback();
    }
  };

  const handleDownload = async (filename: string) => {
    if (playingFilename === filename) {
      stopPlayback();
    }

    setDownloadError(null);
    setProgress(null);
    setActiveDownload(filename);

    const result = await downloadMusic(filename, setProgress);

    setActiveDownload(null);
    setProgress(null);
    if (!result.ok) {
      setDownloadError(result.message);
    }
  };

  if (!isSupabaseEnvValid) {
    return (
      <p className="text-gray-400 text-lg">Sounds are unavailable — check Supabase settings.</p>
    );
  }

  const downloadPercent = progress?.percent;
  const showLargeHint = isLargeDownload(progress?.total ?? null);

  return (
    <section>
      <audio ref={audioRef} className="hidden" aria-hidden preload="none" />

      <h1 className="text-2xl md:text-3xl font-bold mb-2 font-netflix uppercase">Nature Sounds</h1>
      <p className="text-gray-400 text-base md:text-lg mb-6">
        Listen here or tap Download to save calm music on your iPad.
      </p>

      {loading ? (
        <p className="text-gray-400">Loading sounds…</p>
      ) : loadError ? (
        <p className="text-red-400" role="alert">
          Could not load sounds: {loadError}
        </p>
      ) : tracks.length === 0 ? (
        <p className="text-gray-400 text-base">No sounds available yet.</p>
      ) : (
        <ul className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
          {tracks.map((filename, index) => {
            const isDownloading = activeDownload === filename;
            const isPlaying = playingFilename === filename;
            const title = displayMusicTitle(filename, index);
            const hasUrl = Boolean(getMusicPublicUrl(filename));
            const busy = activeDownload !== null;

            return (
              <li
                key={filename}
                className="flex flex-col gap-3 rounded-xl bg-zinc-800 border border-zinc-700 p-5"
              >
                <span className="text-xl md:text-2xl font-bold text-white">{title}</span>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => void togglePlay(filename)}
                    disabled={!hasUrl || busy}
                    className="flex items-center justify-center gap-2 min-h-[4rem] rounded-2xl bg-white text-zinc-900 text-lg font-bold hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-white/50"
                    aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
                  >
                    {isPlaying ? (
                      <>
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Play
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDownload(filename)}
                    disabled={!hasUrl || busy}
                    className="flex items-center justify-center gap-2 min-h-[4rem] rounded-2xl bg-netflix-red text-white text-lg font-bold hover:bg-red-600 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-netflix-red/50"
                    aria-label={`Download ${title}`}
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
                    </svg>
                    {isDownloading ? 'Saving…' : 'Download'}
                  </button>
                </div>

                {isDownloading && (
                  <div className="space-y-2" role="status" aria-live="polite">
                    {downloadPercent != null ? (
                      <>
                        <p className="text-gray-300 text-base">
                          {downloadPercent}%
                          {progress?.total ? (
                            <span className="text-gray-500">
                              {' '}
                              ({formatDownloadSize(progress.loaded)} of{' '}
                              {formatDownloadSize(progress.total)})
                            </span>
                          ) : null}
                        </p>
                        <div
                          className="h-3 w-full rounded-full bg-zinc-700 overflow-hidden"
                          role="progressbar"
                          aria-valuenow={downloadPercent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full bg-netflix-red transition-[width] duration-150"
                            style={{ width: `${downloadPercent}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-300 text-base">Downloading… keep this page open.</p>
                    )}
                    {showLargeHint && (
                      <p className="text-yellow-200/90 text-sm">
                        Large file — on school Wi‑Fi this can take a minute.
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {playError && (
        <p className="mt-4 text-yellow-300 text-lg" role="status">
          {playError}
        </p>
      )}

      {downloadError && (
        <p className="mt-4 text-red-400 text-lg" role="alert">
          {downloadError}
        </p>
      )}
    </section>
  );
};

export default NatureSounds;
