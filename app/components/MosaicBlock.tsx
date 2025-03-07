'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MosaicBlockProps } from '@/types/index';

const colorMap = {
  primary: "#9945FF",
  secondary: "#03E1FF",
  tertiary: "#14F195",
};

const MosaicBlock: React.FC<MosaicBlockProps> = ({ color, delay = 0 }) => {
  const blockColor = colorMap[color];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="w-36 h-36 md:w-48 md:h-48 rounded-lg relative overflow-hidden animate-float"
      style={{ 
        animationDelay: `${delay * 0.5}s`,
        backgroundColor: blockColor,
        opacity: 0.8
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <motion.div
        animate={{ 
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.02, 1, 0.98, 1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay
        }}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default MosaicBlock; 