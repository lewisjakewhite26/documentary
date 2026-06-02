import React from 'react';
import { isSupabaseConfigured, SUPABASE_CONFIG_MESSAGE } from '../lib/supabase';
import Header from './Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-netflix-bg min-h-screen text-white font-sans">
      <Header />
      {!isSupabaseConfigured && (
        <div
          className="mx-4 mt-4 px-4 py-3 bg-yellow-900/80 border border-yellow-600 rounded text-yellow-100 text-sm"
          role="status"
        >
          {SUPABASE_CONFIG_MESSAGE}
        </div>
      )}
      {children}
    </div>
  );
};

export default Layout;
