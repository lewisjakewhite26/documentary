import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { VideosProvider } from './context/VideosContext';
import CategoryPage from './pages/CategoryPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <VideosProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch/:slug" element={<CategoryPage />} />
        </Routes>
      </VideosProvider>
    </BrowserRouter>
  );
};

export default App;
