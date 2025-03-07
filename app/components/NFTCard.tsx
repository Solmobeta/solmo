'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NFTCardProps } from '@/types/index';

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="card overflow-hidden"
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
        {/* Placeholder image - in a real project, should use Next.js Image component for optimization */}
        <div
          className="w-full h-full bg-center bg-cover transition-transform duration-500"
          style={{ 
            backgroundImage: `url(${nft.image.replace('placeholder', getRandomImageId())})`,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-sm">
          {nft.price} SOL
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-1">{nft.name}</h3>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm opacity-70">Creator: {nft.creator}</span>
        <span className={`text-xs px-2 py-1 rounded ${getCollectionColor(nft.collection)}`}>
          {getCollectionName(nft.collection)}
        </span>
      </div>
      
      <p className="text-sm opacity-70 mb-4 line-clamp-2">{nft.description}</p>
      
      <div className="flex space-x-2">
        <Link 
          href={`/nft/${nft.id}`}
          className="flex-1 text-center btn-primary py-2 text-sm"
        >
          View Details
        </Link>
        <button className="flex-1 btn-secondary py-2 text-sm">
          Buy
        </button>
      </div>
    </motion.div>
  );
};

// Helper function - Get collection name
const getCollectionName = (collection: string): string => {
  switch (collection) {
    case 'art':
      return 'Art';
    case 'gaming':
      return 'Gaming';
    case 'metaverse':
      return 'Metaverse';
    default:
      return 'Other';
  }
};

// Helper function - Get collection color class
const getCollectionColor = (collection: string): string => {
  switch (collection) {
    case 'art':
      return 'bg-primary/20 text-primary';
    case 'gaming':
      return 'bg-secondary/20 text-secondary';
    case 'metaverse':
      return 'bg-tertiary/20 text-tertiary';
    default:
      return 'bg-white/20 text-white';
  }
};

// Helper function - Generate random image ID to replace placeholders
const getRandomImageId = (): string => {
  // Use a predefined set of image IDs
  const imageIds = [
    'QmNLr4G7XUAK6ykG4janpvB2MLnwyVmZKPaM5sxTpHG8zz',
    'QmZ8Syn28bEhZJKYeZCxUTM5Ut74ccKKDbQCqk5AaYsVwq',
    'QmZXx7GEu7P5HxRfA8Gp5GtoFEwB1pUPzMq3Jt7aMhjgqf',
    'QmSmJ6K3Z3ynGvKRGP6aJeT2sQ2tc3PRnmWfzVJvdgdC8N',
    'QmXEXacf3GYGhbqe4LE4eFQknwzBQx8C6KcS4zt63n41zs',
    'Qma8mnc7KcWKa1JKUH4Xx9KmFv9XfZQhychpHSytJnkJeE',
    'QmVWdUfQVRdXz7xMDQkH35NAa8AJUxA3QXxNE2YHtUYxvz'
  ];
  
  return imageIds[Math.floor(Math.random() * imageIds.length)];
};

export default NFTCard; 