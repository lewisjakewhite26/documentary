import React from 'react';
import AnimalPicker from '../components/AnimalPicker';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { useVideos } from '../hooks/useVideos';

const HomePage: React.FC = () => {
  const { videosByCategory, loading } = useVideos();
  const introCount = videosByCategory.intro?.length ?? 0;

  return (
    <Layout>
      <Hero />
      <main className="w-full max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-8 space-y-8">
        <section>
          <Link
            to="/watch/intro"
            className="flex items-center justify-between w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 border-2 border-transparent hover:border-netflix-red focus:outline-none focus:ring-4 focus:ring-netflix-red/60 transition-colors px-6 py-5"
          >
            <span className="font-netflix text-2xl md:text-3xl uppercase">Intro</span>
            <span className="text-gray-400 text-sm md:text-base">
              {loading
                ? 'Loading…'
                : `Habitats & more · ${introCount} video${introCount === 1 ? '' : 's'}`}
            </span>
          </Link>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pick an animal</h2>
          <AnimalPicker />
        </section>
      </main>
    </Layout>
  );
};

export default HomePage;
