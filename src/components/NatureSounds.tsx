import React, { useEffect, useState } from 'react';
import {
  downloadMusic,
  formatDownloadSize,
  isLargeDownload,
  type DownloadProgress,
} from '../lib/download';
import { displayMusicTitle, fetchMusicTracks } from '../lib/music';
import { isSupabaseEnvValid } from '../lib/supabase';

const NatureSounds: React.FC = () => {
  const [tracks, setTracks] = useState<string[]>([]);
  const [loading, setLoading] = useState(isSupabaseEnvValid);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeDownload, setActiveDownload] = useState<string | null>(null);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseEnvValid) return;

    let cancelled = false;
    void fetchMusicTracks().then(({ tracks: list, error }) => {
      if (cancelled) return;
      setTracks(list);
      setLoadError(error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = async (filename: string) => {
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

  if (!isSupabaseEnvValid) return null;
  if (!loading && tracks.length === 0 && !loadError) return null;

  const downloadPercent = progress?.percent;
  const showLargeHint = isLargeDownload(progress?.total ?? null);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Nature sounds</h2>
      <p className="text-gray-400 text-base md:text-lg mb-4">
        Download calm music to keep on your iPad — tap Download on each sound.
      </p>

      {loading ? (
        <p className="text-gray-400">Loading sounds…</p>
      ) : loadError ? (
        <p className="text-red-400" role="alert">
          Could not load sounds: {loadError}
        </p>
      ) : (
        <ul className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
          {tracks.map((filename, index) => {
            const isActive = activeDownload === filename;
            const title = displayMusicTitle(filename, index);

            return (
              <li
                key={filename}
                className="flex flex-col gap-3 rounded-xl bg-zinc-800 border border-zinc-700 p-5"
              >
                <span className="text-xl md:text-2xl font-bold text-white">{title}</span>
                <button
                  type="button"
                  onClick={() => void handleDownload(filename)}
                  disabled={activeDownload !== null}
                  className="flex items-center justify-center gap-3 min-h-[4rem] rounded-2xl bg-netflix-red text-white text-xl font-bold hover:bg-red-600 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-netflix-red/50"
                  aria-label={`Download ${title}`}
                >
                  <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
                  </svg>
                  {isActive ? 'Downloading…' : 'Download'}
                </button>

                {isActive && (
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

      {downloadError && (
        <p className="mt-4 text-red-400 text-lg" role="alert">
          {downloadError}
        </p>
      )}
    </section>
  );
};

export default NatureSounds;
