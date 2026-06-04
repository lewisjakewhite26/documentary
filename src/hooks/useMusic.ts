import { useContext } from 'react';
import { MusicContext, type MusicContextValue } from '../context/music-context';

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return ctx;
}
