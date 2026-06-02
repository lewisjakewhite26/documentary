// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center px-4 py-3 bg-netflix-bg shadow-md">
      <h1 className="font-netflix text-4xl md:text-5xl leading-none tracking-wide text-white uppercase">
        MR <span className="text-netflix-red">W</span>HITEFLIX
      </h1>
    </header>
  );
};

export default Header;
