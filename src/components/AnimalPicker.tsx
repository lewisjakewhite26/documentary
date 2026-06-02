import React from 'react';
import { Link } from 'react-router-dom';
import { animalCategories, categoryToSlug, formatCategoryTitle } from '../categories';
import { useVideos } from '../hooks/useVideos';

const AnimalPicker: React.FC = () => {
  const { videosByCategory, loading } = useVideos();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {animalCategories.map((cat) => {
        const count = videosByCategory[cat.name]?.length ?? 0;
        const slug = categoryToSlug(cat.name);

        return (
          <Link
            key={cat.name}
            to={`/watch/${slug}`}
            className="flex flex-col items-center justify-center min-h-24 md:min-h-28 rounded-xl bg-zinc-800 hover:bg-zinc-700 border-2 border-transparent hover:border-netflix-red focus:outline-none focus:ring-4 focus:ring-netflix-red/60 transition-colors px-3 py-4 text-center"
          >
            <span className="font-netflix text-xl md:text-2xl text-white uppercase leading-tight">
              {formatCategoryTitle(cat.name)}
            </span>
            <span className="mt-2 text-xs text-gray-400">
              {loading ? '…' : `${count} video${count === 1 ? '' : 's'}`}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default AnimalPicker;
