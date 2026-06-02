import React from 'react';
import { getSupabaseEnvBannerMessage } from '../lib/env';
import Header from './Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bannerMessage = getSupabaseEnvBannerMessage();

  return (
    <div className="bg-netflix-bg min-h-screen text-white font-sans">
      <a
        href="#main-content"
        className="sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-zinc-900 focus:font-semibold focus:outline-none focus:ring-4 focus:ring-netflix-red"
      >
        Skip to main content
      </a>
      <Header />
      {bannerMessage && (
        <div
          className="mx-4 mt-4 px-4 py-3 bg-yellow-900/80 border border-yellow-600 rounded text-yellow-100 text-sm"
          role="status"
        >
          {bannerMessage}
        </div>
      )}
      <div id="main-content">{children}</div>
    </div>
  );
};

export default Layout;
