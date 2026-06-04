import { createContext } from 'react';

export type MusicContextValue = {
  musicAvailable: boolean;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  pauseForVideo: () => void;
  resumeAfterVideo: () => void;
};

export const MusicContext = createContext<MusicContextValue | null>(null);
