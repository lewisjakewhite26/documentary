import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { MusicProvider } from './context/MusicContext';
import { VideosProvider } from './context/VideosContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

const PageFallback = () => (
  <div className="min-h-screen bg-netflix-bg flex items-center justify-center text-gray-400 text-lg">
    Loading…
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <VideosProvider>
          <MusicProvider>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/watch/:slug" element={<CategoryPage />} />
              </Routes>
            </Suspense>
          </MusicProvider>
        </VideosProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
