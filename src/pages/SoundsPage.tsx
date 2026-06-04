import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import NatureSounds from '../components/NatureSounds';

const SoundsPage: React.FC = () => {
  return (
    <Layout>
      <main className="w-full max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-lg font-semibold text-gray-300 hover:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-netflix-red rounded px-2 py-1"
        >
          ← Back home
        </Link>

        <NatureSounds />
      </main>
    </Layout>
  );
};

export default SoundsPage;
