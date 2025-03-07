'use client';

import { motion } from 'framer-motion';
import React from 'react';

const Logo: React.FC = () => {
  return (
    <motion.div
      initial={{ rotate: -5 }}
      animate={{ rotate: 5 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
      className="relative w-10 h-10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="w-full h-full">
        {/* Floating Block Composition */}
        <g transform="rotate(-10, 250, 250)">
          <rect x="170" y="170" width="60" height="60" fill="#9945FF" opacity="0.8" />
          <rect x="240" y="170" width="60" height="60" fill="#03E1FF" opacity="0.7" />
          <rect x="310" y="170" width="60" height="60" fill="#14F195" opacity="0.9" />
          <rect x="170" y="240" width="60" height="60" fill="#14F195" opacity="0.7" />
          <rect x="240" y="240" width="60" height="60" fill="#9945FF" opacity="0.8" />
          <rect x="310" y="240" width="60" height="60" fill="#03E1FF" opacity="0.6" />
        </g>
        {/* Central Circle Element */}
        <circle cx="250" cy="250" r="20" fill="#ffffff" stroke="#1E1E1E" strokeWidth="3" />
      </svg>
    </motion.div>
  );
};

export default Logo; 