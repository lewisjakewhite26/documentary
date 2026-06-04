import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getMusicPublicUrl, MUSIC_VOLUME } from '../lib/music';

interface SoundscapePlayerProps {
  trackFilenames: string[];
  playing: boolean;
}

function pickNextIndex(current: number, total: number): number {
  if (total <= 1) return 0;
  let next = Math.floor(Math.random() * total);
  while (next === current) {
    next = Math.floor(Math.random() * total);
  }
  return next;
}

const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({ trackFilenames, playing }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(() =>
    Math.floor(Math.random() * Math.max(1, trackFilenames.length))
  );

  const currentFilename = trackFilenames[trackIndex] ?? '';
  const currentUrl = currentFilename ? getMusicPublicUrl(currentFilename) : null;

  const playCurrent = useCallback(async () => {
    const el = audioRef.current;
    if (!el || !currentUrl) return;
    el.volume = MUSIC_VOLUME;
    try {
      await el.play();
    } catch {
      /* autoplay blocked until user enables music via toggle */
    }
  }, [currentUrl]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (playing) {
      void playCurrent();
    } else {
      pause();
    }
  }, [playing, playCurrent, pause, currentUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onEnded = () => {
      setTrackIndex((i) => pickNextIndex(i, trackFilenames.length));
    };

    el.addEventListener('ended', onEnded);
    return () => el.removeEventListener('ended', onEnded);
  }, [trackFilenames.length]);

  useEffect(() => {
    if (playing) {
      void playCurrent();
    }
  }, [trackIndex, playing, playCurrent]);

  if (!currentUrl) return null;

  return (
    <audio ref={audioRef} src={currentUrl} preload="auto" aria-hidden className="hidden" />
  );
};

export default SoundscapePlayer;
