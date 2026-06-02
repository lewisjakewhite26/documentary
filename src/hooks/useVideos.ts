import { useContext } from 'react';
import { VideosContext } from '../context/videos-context';

export function useVideos() {
  const ctx = useContext(VideosContext);
  if (!ctx) {
    throw new Error('useVideos must be used within VideosProvider');
  }
  return ctx;
}
