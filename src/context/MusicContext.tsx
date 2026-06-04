import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SoundscapePlayer from '../components/SoundscapePlayer';
import {
  fetchMusicTracks,
  readMusicEnabledPreference,
  writeMusicEnabledPreference,
} from '../lib/music';
import { MusicContext } from './music-context';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trackFilenames, setTrackFilenames] = useState<string[]>([]);
  const [musicEnabled, setMusicEnabledState] = useState(readMusicEnabledPreference);
  const [videoPauseDepth, setVideoPauseDepth] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void fetchMusicTracks().then(({ tracks }) => {
      if (!cancelled) setTrackFilenames(tracks);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setMusicEnabled = useCallback((enabled: boolean) => {
    setMusicEnabledState(enabled);
    writeMusicEnabledPreference(enabled);
  }, []);

  const pauseForVideo = useCallback(() => {
    setVideoPauseDepth((d) => d + 1);
  }, []);

  const resumeAfterVideo = useCallback(() => {
    setVideoPauseDepth((d) => Math.max(0, d - 1));
  }, []);

  const shouldPlayMusic = musicEnabled && videoPauseDepth === 0;

  const value = useMemo(
    () => ({
      musicAvailable: trackFilenames.length > 0,
      musicEnabled,
      setMusicEnabled,
      pauseForVideo,
      resumeAfterVideo,
    }),
    [trackFilenames.length, musicEnabled, setMusicEnabled, pauseForVideo, resumeAfterVideo]
  );

  return (
    <MusicContext.Provider value={value}>
      {trackFilenames.length > 0 && (
        <SoundscapePlayer
          trackFilenames={trackFilenames}
          playing={shouldPlayMusic}
        />
      )}
      {children}
    </MusicContext.Provider>
  );
};
