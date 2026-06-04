import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="flex items-center px-4 py-3 bg-netflix-bg shadow-md">
      <Link
        to="/"
        className="font-netflix text-4xl md:text-5xl leading-none tracking-wide text-white uppercase hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-netflix-red rounded"
      >
        MR <span className="text-netflix-red">W</span>HITEFLIX
      </Link>
    </header>
  );
};

export default Header;
