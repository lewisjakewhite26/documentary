// src/components/Hero.tsx
import React from 'react';

const HERO_IMAGE = '/hero-banner.png';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-52 sm:h-64 md:h-80 lg:h-96 overflow-hidden bg-netflix-bg">
      <img
        src={HERO_IMAGE}
        alt="MR WHITEFLIX"
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
        decoding="async"
      />
      {/* Fade to page background on all sides */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: [
            'linear-gradient(to top, #141414 0%, transparent 42%)',
            'linear-gradient(to bottom, #141414 0%, transparent 42%)',
            'linear-gradient(to left, #141414 0%, transparent 38%)',
            'linear-gradient(to right, #141414 0%, transparent 38%)',
            'radial-gradient(ellipse 75% 65% at 50% 45%, transparent 25%, rgba(20, 20, 20, 0.55) 100%)',
          ].join(', '),
        }}
      />
    </section>
  );
};

export default Hero;
